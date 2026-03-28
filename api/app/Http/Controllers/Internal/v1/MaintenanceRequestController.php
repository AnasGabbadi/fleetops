<?php

namespace App\Http\Controllers\Internal\v1;

use Fleetbase\FleetOps\Http\Controllers\FleetOpsController;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MaintenanceRequestController extends FleetOpsController
{
    public $resource = 'maintenance-request';

    public function createRecord(Request $request)
    {
        try {
            $input = $request->input('maintenanceRequest')
                   ?? $request->input('maintenance_request')
                   ?? $request->all();

            $snakeInput = [];
            foreach ($input as $key => $value) {
                $snakeInput[Str::snake($key)] = $value;
            }

            unset($snakeInput['created_by_uuid'], $snakeInput['updated_by_uuid'], $snakeInput['public_id']);

            $snakeInput['company_uuid'] = session('company') 
                ?? $snakeInput['company_uuid'] 
                ?? $request->user()->company_uuid 
                ?? null;
            $snakeInput['user_uuid']      = session('user') ?? $snakeInput['user_uuid'] ?? null;
            $snakeInput['priority']       = $snakeInput['priority'] ?? 'medium';
            $snakeInput['status']         = $snakeInput['status'] ?? 'pending';
            $snakeInput['payment_status'] = $snakeInput['payment_status'] ?? 'unpaid';
            $snakeInput['scheduled_date'] = $snakeInput['scheduled_date'] ?? now()->toDateString();

            $model = \Fleetbase\FleetOps\Models\MaintenanceRequest::create($snakeInput);

            \Fleetbase\FleetOps\Http\Resources\v1\MaintenanceRequest::wrap('maintenanceRequest');

            return new \Fleetbase\FleetOps\Http\Resources\v1\MaintenanceRequest($model);

        } catch (\Exception $e) {
            return response()->json([
                'errors' => [['detail' => $e->getMessage()]]
            ], 400);
        }
    }

public function queryRecords(Request $request)
{
    try {
        $page  = (int) $request->input('page', 1);
        $limit = (int) $request->input('limit', 10);

        // $companyUuid = session('company');
        
        // ✅ Gérer le paramètre sort envoyé par Ember (-createdAt, createdAt, -status, etc.)
        $sortParam = $request->input('sort', '-createdAt');
        $sortDesc  = str_starts_with($sortParam, '-');
        $sortField = ltrim($sortParam, '-');

        // Convertir camelCase → snake_case
        $sortColumn = \Illuminate\Support\Str::snake($sortField);

        // Colonnes autorisées pour éviter injection SQL
        $allowedSorts = ['created_at', 'updated_at', 'status', 'total_cost_mad', 'scheduled_date', 'priority'];
        if (!in_array($sortColumn, $allowedSorts)) {
            $sortColumn = 'created_at';
        }

        // $results = \Fleetbase\FleetOps\Models\MaintenanceRequest::where('company_uuid', $companyUuid)
        //     ->orderBy('created_at', 'desc')
        //     ->paginate($limit, ['*'], 'page', $page);

        //  $results = \Fleetbase\FleetOps\Models\MaintenanceRequest::orderBy('created_at', 'desc')
        //     ->paginate($limit, ['*'], 'page', $page);
        $companyUuid = session('company') ?? $request->user()->company_uuid;
        
        $results = \Fleetbase\FleetOps\Models\MaintenanceRequest::with([
                'vehicle',
                'garage',
                'maintenanceItems.repairProduct',
            ])
             ->where('company_uuid', $companyUuid)
            ->orderBy($sortColumn, $sortDesc ? 'desc' : 'asc')
            ->paginate($limit, ['*'], 'page', $page);

        $items = $results->map(function ($m) {
            return [
                // --- IDs ---
                'id'               => $m->uuid,
                'uuid'             => $m->uuid,
                'publicId'             => $m->public_id,
                'vehicleUuid'          => $m->vehicle_uuid,
                'garageUuid'           => $m->garage_uuid,

                // --- Prestation ---
                'maintenanceType'      => $m->maintenance_type,
                'status'               => $m->status,
                'priority'             => $m->priority ?? 'medium',
                'paymentStatus'        => $m->payment_status ?? 'unpaid',
                'city'                 => $m->city,

                // --- Coûts ---
                'totalProductsCostMad' => $m->total_products_cost_mad,
                'garageServiceCostMad' => $m->garage_service_cost_mad,
                'subtotalMad'          => $m->subtotal_mad,
                'taxMad'               => $m->tax_mad,
                'discountMad'          => $m->discount_mad,
                'totalCostMad'         => $m->total_cost_mad,
                'currency'             => $m->currency ?? 'MAD',

                // --- Réservation ---
                'scheduledDate'        => $m->scheduled_date,
                'scheduledTime'        => $m->scheduled_time,
                'notes'                => $m->notes,
                'customerMessage'      => $m->customer_message,

                // --- Véhicule (relation) ---
                'vehicleLabel'  => $m->vehicle
                    ? trim($m->vehicle->plate_number . ' · ' . $m->vehicle->make . ' ' . $m->vehicle->model)
                    : null,

                'garageName'    => $m->garage?->name,

                'productsCount' => $m->maintenanceItems->count(),

                // --- Dates ---
                'createdAt' => $m->created_at,
                'updatedAt' => $m->updated_at,
            ];
        });

        return response()->json([
            'maintenanceRequests' => $items,
            'meta' => [
                'current_page' => $results->currentPage(),
                'last_page'    => $results->lastPage(),
                'per_page'     => $results->perPage(),
                'total'        => $results->total(),
                'from'         => $results->firstItem(),
                'to'           => $results->lastItem(),
            ],
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'errors' => [['detail' => $e->getMessage()]],
        ], 400);
    }
}
}
