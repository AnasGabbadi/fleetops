<?php

namespace Fleetbase\FleetOps\Http\Controllers\Api\v1;

use Fleetbase\FleetOps\Models\Garage;
use Fleetbase\FleetOps\Models\AppointmentSlot;
use Fleetbase\FleetOps\Http\Resources\v1\GarageResource;
use Fleetbase\FleetOps\Http\Resources\v1\AppointmentSlotResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class GarageController extends Controller
{
    /**
     * Display a listing of garages.
     * GET /api/v1/garages
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection
    {
        $city = $request->input('city');
        $search = $request->input('search');
        $limit = $request->input('limit', 20);
        $page = $request->input('page', 1);
        $sort = $request->input('sort', '-created_at');

        $query = Garage::query();

        // Filtrer par entreprise
        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        // Filtrer par ville
        if ($city) {
            $query->byCity($city);
        }

        // Recherche textuelle
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Filtrer garages actifs
        $query->active();

        // Trier
        if (str_starts_with($sort, '-')) {
            $query->orderByDesc(substr($sort, 1));
        } else {
            $query->orderBy($sort);
        }

        // Paginer
        $garages = $query->paginate($limit, ['*'], 'page', $page);

        return GarageResource::collection($garages);
    }

    /**
     * Display a specific garage.
     * GET /api/v1/garages/{id}
     *
     * @param Garage $garage
     * @return GarageResource
     */
    public function show(Garage $garage): GarageResource
    {
        return new GarageResource($garage);
    }

    /**
     * Create a new garage.
     * POST /api/v1/garages
     *
     * @param Request $request
     * @return GarageResource
     */
    public function store(Request $request): GarageResource
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'description'          => 'nullable|string',
            'phone'                => 'nullable|string|max:20',
            'email'                => 'nullable|email',
            'address'              => 'nullable|string|max:500',
            'city'                 => 'required|string|max:100',
            'latitude'             => 'nullable|numeric',
            'longitude'            => 'nullable|numeric',
            'base_price_mad'       => 'required|numeric|min:0',
            'currency'             => 'nullable|string|default:MAD',
            'services_offered'     => 'nullable|array',
            'is_active'            => 'nullable|boolean|default:true',
            'working_hours_start'  => 'nullable|date_format:H:i|default:09:00',
            'working_hours_end'    => 'nullable|date_format:H:i|default:17:30',
            'rating'               => 'nullable|numeric|min:0|max:5',
            'api_reference'        => 'nullable|string',
            'meta'                 => 'nullable|array',
        ]);

        $validated['company_uuid'] = $request->user()->company_uuid;

        $garage = Garage::create($validated);

        return new GarageResource($garage);
    }

    /**
     * Update a garage.
     * PUT /api/v1/garages/{id}
     *
     * @param Request $request
     * @param Garage $garage
     * @return GarageResource
     */
    public function update(Request $request, Garage $garage): GarageResource
    {
        $validated = $request->validate([
            'name'                 => 'sometimes|string|max:255',
            'description'          => 'nullable|string',
            'phone'                => 'nullable|string|max:20',
            'email'                => 'nullable|email',
            'address'              => 'nullable|string|max:500',
            'city'                 => 'sometimes|string|max:100',
            'latitude'             => 'nullable|numeric',
            'longitude'            => 'nullable|numeric',
            'base_price_mad'       => 'sometimes|numeric|min:0',
            'currency'             => 'nullable|string',
            'services_offered'     => 'nullable|array',
            'is_active'            => 'nullable|boolean',
            'working_hours_start'  => 'nullable|date_format:H:i',
            'working_hours_end'    => 'nullable|date_format:H:i',
            'rating'               => 'nullable|numeric|min:0|max:5',
            'api_reference'        => 'nullable|string',
            'meta'                 => 'nullable|array',
        ]);

        $garage->update($validated);

        return new GarageResource($garage);
    }

    /**
     * Delete a garage.
     * DELETE /api/v1/garages/{id}
     *
     * @param Garage $garage
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Garage $garage)
    {
        $garage->delete();

        return response()->json([
            'message' => 'Garage deleted successfully',
            'data'    => new GarageResource($garage),
        ], 200);
    }

    /**
     * Get garages by city.
     * GET /api/v1/garages/city/{city}
     *
     * @param string $city
     * @param Request $request
     * @return ResourceCollection
     */
    public function byCity(string $city, Request $request): ResourceCollection
    {
        $limit = $request->input('limit', 20);

        $query = Garage::byCity($city)->active();

        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        $garages = $query->paginate($limit);

        return GarageResource::collection($garages);
    }

    /**
     * Get available appointment slots for a garage.
     * GET /api/v1/garages/{id}/slots
     *
     * @param Request $request
     * @param Garage $garage
     * @return \Illuminate\Http\JsonResponse
     */
    public function slots(Request $request, Garage $garage)
    {
        $date = $request->input('date');

        if (!$date) {
            return response()->json([
                'message' => 'Date parameter is required',
            ], 400);
        }

        $slots = $garage->getAvailableSlotsForDate($date);

        return response()->json([
            'garage' => new GarageResource($garage),
            'date'   => $date,
            'slots'  => AppointmentSlotResource::collection($slots),
        ]);
    }

    /**
     * Get top rated garages.
     * GET /api/v1/garages/top-rated
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function topRated(Request $request): ResourceCollection
    {
        $limit = $request->input('limit', 10);
        $city = $request->input('city');

        $query = Garage::topRated()->active();

        if ($city) {
            $query->byCity($city);
        }

        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        $garages = $query->limit($limit)->get();

        return GarageResource::collection($garages);
    }

    /**
     * Get garages offering a specific service.
     * GET /api/v1/garages/service/{service}
     *
     * @param string $service
     * @param Request $request
     * @return ResourceCollection
     */
    public function byService(string $service, Request $request): ResourceCollection
    {
        $limit = $request->input('limit', 20);
        $city = $request->input('city');

        $query = Garage::offeringService($service)->active();

        if ($city) {
            $query->byCity($city);
        }

        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        $garages = $query->paginate($limit);

        return GarageResource::collection($garages);
    }
}