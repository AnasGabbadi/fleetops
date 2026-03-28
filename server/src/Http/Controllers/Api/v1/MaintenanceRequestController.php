<?php

namespace Fleetbase\FleetOps\Http\Controllers\Api\v1;

use Fleetbase\FleetOps\Models\MaintenanceRequest;
use Fleetbase\FleetOps\Models\AppointmentSlot;
use Fleetbase\FleetOps\Http\Resources\v1\MaintenanceRequestResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Str;

class MaintenanceRequestController extends Controller
{
    /**
     * Display a listing of maintenance requests.
     * GET /api/v1/maintenance-requests
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection
    {
        $status = $request->input('status');
        $paymentStatus = $request->input('payment_status');
        $vehicleUuid = $request->input('vehicle_uuid');
        $garageUuid = $request->input('garage_uuid');
        $city = $request->input('city');
        $limit = $request->input('limit', 20);
        $page = $request->input('page', 1);
        $sort = $request->input('sort', '-created_at');

        $query = MaintenanceRequest::query();

        // Filtrer par entreprise
        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        // Filtres
        if ($status) {
            $query->byStatus($status);
        }
        if ($paymentStatus) {
            $query->where('payment_status', $paymentStatus);
        }
        if ($vehicleUuid) {
            $query->byVehicle($vehicleUuid);
        }
        if ($garageUuid) {
            $query->byGarage($garageUuid);
        }
        if ($city) {
            $query->byCity($city);
        }

        // Trier
        if (str_starts_with($sort, '-')) {
            $query->orderByDesc(substr($sort, 1));
        } else {
            $query->orderBy($sort);
        }

        // Paginer
        $requests = $query->paginate($limit, ['*'], 'page', $page);

        Log::info('📤 CONTRÔLEUR INDEX - Première maintenance:', $requests->first()?->toArray($request) ?? []);
        return MaintenanceRequestResource::collection($requests);
    }

    /**
     * Display a specific maintenance request.
     * GET /api/v1/maintenance-requests/{id}
     *
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function show(MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Create a new maintenance request.
     * POST /api/v1/maintenance-requests
     *
     * @param Request $request
     * @return MaintenanceRequestResource
     */
    public function store(Request $request): MaintenanceRequestResource
    {
        $validated = $request->validate([
            'vehicle_uuid'         => 'required|uuid',
            'garage_uuid'          => 'required|uuid|exists:garages,uuid',
            'appointment_slot_uuid' => 'nullable|uuid|exists:appointment_slots,uuid',
            'maintenance_type'     => 'required|string|max:100',
            'status'               => 'nullable|string|default:pending',
            'priority'             => 'nullable|string|default:medium',
            'city'                 => 'required|string|max:100',
            'address'              => 'nullable|string|max:500',
            'garage_service_cost_mad' => 'nullable|numeric|default:0',
            'tax_mad'              => 'nullable|numeric|default:0',
            'discount_mad'         => 'nullable|numeric|default:0',
            'customer_message'     => 'nullable|string',
            'notes'                => 'nullable|string',
            'products'             => 'required|array|min:1',
            'products.*.repair_product_uuid' => 'required|uuid',
            'products.*.product_name'        => 'required|string',
            'products.*.product_sku'         => 'required|string',
            'products.*.quantity'            => 'required|integer|min:1',
            'products.*.unit_price_mad'      => 'required|numeric|min:0',
        ]);


        $maintenanceRequest = MaintenanceRequest::create([
            'company_uuid'          => $request->user()->company_uuid,
            'user_uuid'             => $request->user()->uuid,
            'vehicle_uuid'          => $validated['vehicle_uuid'],
            'garage_uuid'           => $validated['garage_uuid'],
            'appointment_slot_uuid' => $validated['appointment_slot_uuid'],
            'public_id'             => $this->generatePublicId(),
            'maintenance_type'      => $validated['maintenance_type'],
            'status'                => $validated['status'] ?? 'pending',
            'priority'              => $validated['priority'] ?? 'medium',
            'city'                  => $validated['city'],
            'address'               => $validated['address'],
            'garage_service_cost_mad' => $validated['garage_service_cost_mad'] ?? 0,
            'tax_mad'               => $validated['tax_mad'] ?? 0,
            'discount_mad'          => $validated['discount_mad'] ?? 0,
            'customer_message'      => $validated['customer_message'],
            'notes'                 => $validated['notes'],
            'currency'              => 'MAD',
            'created_by_uuid'       => $request->user()->uuid,
        ]);

        $productsTotal = 0;
        foreach ($validated['products'] as $product) {
            $totalPrice = $product['quantity'] * $product['unit_price_mad'];
            $productsTotal += $totalPrice;

            $maintenanceRequest->addItem(
                $product['repair_product_uuid'],
                $product['product_name'],
                $product['product_sku'],
                $product['quantity'],
                $product['unit_price_mad']
            );
        }

        // Calculer les totaux
        $maintenanceRequest->total_products_cost_mad = $productsTotal;
        $maintenanceRequest->subtotal_mad = $productsTotal + ($validated['garage_service_cost_mad'] ?? 0);
        $maintenanceRequest->total_cost_mad = $maintenanceRequest->subtotal_mad + 
                                            ($validated['tax_mad'] ?? 0) - 
                                            ($validated['discount_mad'] ?? 0);
        $maintenanceRequest->save();

        // ✅ VÉRIFIER QUE appointment_slot_uuid N'EST PAS NULL AVANT L'UTILISER
        if ($validated['appointment_slot_uuid']) {
            $slot = AppointmentSlot::findOrFail($validated['appointment_slot_uuid']);
            if ($slot->garage_uuid === $validated['garage_uuid']) {
                $maintenanceRequest->scheduled_date = $slot->date;
                $maintenanceRequest->scheduled_time = $slot->time;
                $maintenanceRequest->save();
                $slot->book();
            }
        }

        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Update a maintenance request.
     * PUT /api/v1/maintenance-requests/{id}
     *
     * @param Request $request
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function update(Request $request, MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        $validated = $request->validate([
            'status'               => 'sometimes|string',
            'priority'             => 'sometimes|string',
            'city'                 => 'sometimes|string|max:100',
            'address'              => 'nullable|string|max:500',
            'customer_message'     => 'nullable|string',
            'notes'                => 'nullable|string',
            'garage_service_cost_mad' => 'nullable|numeric',
            'tax_mad'              => 'nullable|numeric',
            'discount_mad'         => 'nullable|numeric',
            'payment_status'       => 'sometimes|string',
            'payment_method'       => 'nullable|string',
            'payment_reference'    => 'nullable|string',
        ]);

        $maintenanceRequest->update($validated);

        // Recalculer les totaux si nécessaire
        if (isset($validated['garage_service_cost_mad']) || 
            isset($validated['tax_mad']) || 
            isset($validated['discount_mad'])) {
            $maintenanceRequest->recalculateTotal();
        }

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Delete a maintenance request.
     * DELETE /api/v1/maintenance-requests/{id}
     *
     * @param MaintenanceRequest $maintenanceRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(MaintenanceRequest $maintenanceRequest)
    {
        $maintenanceRequest->delete();

        return response()->json([
            'message' => 'Maintenance request deleted successfully',
        ], 200);
    }

    /**
     * Confirm a maintenance request.
     * POST /api/v1/maintenance-requests/{id}/confirm
     *
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function confirm(MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        if (!$maintenanceRequest->confirm()) {
            return response()->json([
                'message' => 'Cannot confirm a maintenance request that is not in pending status',
            ], 400);
        }

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Start a maintenance request.
     * POST /api/v1/maintenance-requests/{id}/start
     *
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function start(MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        if (!$maintenanceRequest->startMaintenance()) {
            return response()->json([
                'message' => 'Cannot start a maintenance request that is not confirmed',
            ], 400);
        }

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Complete a maintenance request.
     * POST /api/v1/maintenance-requests/{id}/complete
     *
     * @param Request $request
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function complete(Request $request, MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        if (!$maintenanceRequest->complete($validated)) {
            return response()->json([
                'message' => 'Cannot complete a maintenance request in this status',
            ], 400);
        }

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Mark a maintenance request as paid.
     * POST /api/v1/maintenance-requests/{id}/mark-paid
     *
     * @param Request $request
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function markPaid(Request $request, MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        $validated = $request->validate([
            'payment_method'    => 'nullable|string',
            'payment_reference' => 'nullable|string',
        ]);

        $maintenanceRequest->markAsPaid(
            $validated['payment_method'] ?? 'cash',
            $validated['payment_reference'] ?? null
        );

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Cancel a maintenance request.
     * POST /api/v1/maintenance-requests/{id}/cancel
     *
     * @param Request $request
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function cancel(Request $request, MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        if (!$maintenanceRequest->cancel($validated['reason'] ?? null)) {
            return response()->json([
                'message' => 'Cannot cancel a completed maintenance request',
            ], 400);
        }

        // Annuler la réservation du créneau
        if ($maintenanceRequest->appointmentSlot) {
            $maintenanceRequest->appointmentSlot->cancelBooking();
        }

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Apply discount code to maintenance request.
     * POST /api/v1/maintenance-requests/{id}/apply-discount
     *
     * @param Request $request
     * @param MaintenanceRequest $maintenanceRequest
     * @return MaintenanceRequestResource
     */
    public function applyDiscount(Request $request, MaintenanceRequest $maintenanceRequest): MaintenanceRequestResource
    {
        $validated = $request->validate([
            'discount_amount' => 'required|numeric|min:0',
        ]);

        if (!$maintenanceRequest->applyDiscount($validated['discount_amount'])) {
            return response()->json([
                'message' => 'Discount amount exceeds subtotal',
            ], 400);
        }

        Log::info('📤 CONTRÔLEUR STORE - Réponse:', (new MaintenanceRequestResource($maintenanceRequest))->toArray($request));
        return new MaintenanceRequestResource($maintenanceRequest);
    }

    /**
     * Get maintenance requests by status.
     * GET /api/v1/maintenance-requests/status/{status}
     *
     * @param string $status
     * @param Request $request
     * @return ResourceCollection
     */
    public function byStatus(string $status, Request $request): ResourceCollection
    {
        $limit = $request->input('limit', 20);

        $query = MaintenanceRequest::byStatus($status);

        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        $requests = $query->paginate($limit);

        Log::info('📤 CONTRÔLEUR INDEX - Première maintenance:', $requests->first()?->toArray($request) ?? []);
        return MaintenanceRequestResource::collection($requests);
    }

    /**
     * Get overdue maintenance requests.
     * GET /api/v1/maintenance-requests/overdue
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function overdue(Request $request): ResourceCollection
    {
        $limit = $request->input('limit', 20);

        $query = MaintenanceRequest::overdue();

        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        $requests = $query->paginate($limit);

        Log::info('📤 CONTRÔLEUR INDEX - Première maintenance:', $requests->first()?->toArray($request) ?? []);
        return MaintenanceRequestResource::collection($requests);
    }

    /**
     * Get cost breakdown for a maintenance request.
     * GET /api/v1/maintenance-requests/{id}/cost-breakdown
     *
     * @param MaintenanceRequest $maintenanceRequest
     * @return \Illuminate\Http\JsonResponse
     */
    public function costBreakdown(MaintenanceRequest $maintenanceRequest)
    {
        return response()->json($maintenanceRequest->getCostBreakdown());
    }

    /**
     * Generate a unique public ID for maintenance requests.
     *
     * @return string
     */
    private function generatePublicId(): string
    {
        $year = now()->year;
        $count = MaintenanceRequest::whereYear('created_at', $year)->count() + 1;

        return "MNT-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}