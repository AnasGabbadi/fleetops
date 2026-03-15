<?php

namespace Fleetbase\FleetOps\Http\Controllers\Api\v1;

use Fleetbase\FleetOps\Models\AppointmentSlot;
use Fleetbase\FleetOps\Http\Resources\v1\AppointmentSlotResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AppointmentSlotController extends Controller
{
    /**
     * Display a listing of appointment slots.
     * GET /api/v1/appointment-slots
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection
    {
        $garageUuid = $request->input('garage_uuid');
        $date = $request->input('date');
        $available = $request->input('available');
        $limit = $request->input('limit', 50);
        $page = $request->input('page', 1);

        $query = AppointmentSlot::query();

        // Filtrer par garage
        if ($garageUuid) {
            $query->forGarage($garageUuid);
        }

        // Filtrer par date
        if ($date) {
            $query->onDate($date);
        }

        // Filtrer par disponibilité
        if ($available !== null) {
            $query->where('is_available', (bool) $available);
        }

        // Futur uniquement par défaut
        $query->future()->ordered();

        // Paginer
        $slots = $query->paginate($limit, ['*'], 'page', $page);

        return AppointmentSlotResource::collection($slots);
    }

    /**
     * Display a specific appointment slot.
     * GET /api/v1/appointment-slots/{id}
     *
     * @param AppointmentSlot $slot
     * @return AppointmentSlotResource
     */
    public function show(AppointmentSlot $slot): AppointmentSlotResource
    {
        return new AppointmentSlotResource($slot);
    }

    /**
     * Create a new appointment slot.
     * POST /api/v1/appointment-slots
     *
     * @param Request $request
     * @return AppointmentSlotResource
     */
    public function store(Request $request): AppointmentSlotResource
    {
        $validated = $request->validate([
            'garage_uuid'      => 'required|uuid|exists:garages,uuid',
            'date'             => 'required|date_format:Y-m-d|after_or_equal:today',
            'time'             => 'required|date_format:H:i',
            'duration_minutes' => 'nullable|integer|default:60',
            'max_capacity'     => 'nullable|integer|default:1',
            'api_reference'    => 'nullable|string',
            'meta'             => 'nullable|array',
        ]);

        $validated['booked_count'] = 0;
        $validated['is_available'] = true;

        $slot = AppointmentSlot::create($validated);

        return new AppointmentSlotResource($slot);
    }

    /**
     * Update an appointment slot.
     * PUT /api/v1/appointment-slots/{id}
     *
     * @param Request $request
     * @param AppointmentSlot $slot
     * @return AppointmentSlotResource
     */
    public function update(Request $request, AppointmentSlot $slot): AppointmentSlotResource
    {
        $validated = $request->validate([
            'date'             => 'sometimes|date_format:Y-m-d',
            'time'             => 'sometimes|date_format:H:i',
            'duration_minutes' => 'nullable|integer',
            'max_capacity'     => 'nullable|integer|min:1',
            'booked_count'     => 'nullable|integer|min:0',
            'is_available'     => 'nullable|boolean',
            'api_reference'    => 'nullable|string',
            'meta'             => 'nullable|array',
        ]);

        $slot->update($validated);

        return new AppointmentSlotResource($slot);
    }

    /**
     * Delete an appointment slot.
     * DELETE /api/v1/appointment-slots/{id}
     *
     * @param AppointmentSlot $slot
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(AppointmentSlot $slot)
    {
        $slot->delete();

        return response()->json([
            'message' => 'Appointment slot deleted successfully',
            'data'    => new AppointmentSlotResource($slot),
        ], 200);
    }

    /**
     * Get available slots for a specific garage and date.
     * GET /api/v1/appointment-slots/available
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function available(Request $request)
    {
        $garageUuid = $request->input('garage_uuid');
        $date = $request->input('date');

        if (!$garageUuid || !$date) {
            return response()->json([
                'message' => 'garage_uuid and date parameters are required',
            ], 400);
        }

        $slots = AppointmentSlot::forGarage($garageUuid)
            ->onDate($date)
            ->available()
            ->ordered()
            ->get();

        return response()->json([
            'garage_uuid' => $garageUuid,
            'date'        => $date,
            'slots'       => AppointmentSlotResource::collection($slots),
            'count'       => $slots->count(),
        ]);
    }

    /**
     * Book an appointment slot.
     * POST /api/v1/appointment-slots/{id}/book
     *
     * @param AppointmentSlot $slot
     * @return \Illuminate\Http\JsonResponse
     */
    public function book(AppointmentSlot $slot)
    {
        if (!$slot->book()) {
            return response()->json([
                'message' => 'Unable to book this slot - it is full',
            ], 400);
        }

        return response()->json([
            'message' => 'Slot booked successfully',
            'data'    => new AppointmentSlotResource($slot),
        ]);
    }

    /**
     * Cancel a booking for an appointment slot.
     * POST /api/v1/appointment-slots/{id}/cancel-booking
     *
     * @param AppointmentSlot $slot
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancelBooking(AppointmentSlot $slot)
    {
        if (!$slot->cancelBooking()) {
            return response()->json([
                'message' => 'Unable to cancel booking - no bookings found',
            ], 400);
        }

        return response()->json([
            'message' => 'Booking cancelled successfully',
            'data'    => new AppointmentSlotResource($slot),
        ]);
    }

    /**
     * Get slots by garage.
     * GET /api/v1/appointment-slots/garage/{garageUuid}
     *
     * @param string $garageUuid
     * @param Request $request
     * @return ResourceCollection
     */
    public function byGarage(string $garageUuid, Request $request): ResourceCollection
    {
        $date = $request->input('date');
        $limit = $request->input('limit', 50);

        $query = AppointmentSlot::forGarage($garageUuid);

        if ($date) {
            $query->onDate($date);
        }

        $query->future()->ordered();

        $slots = $query->paginate($limit);

        return AppointmentSlotResource::collection($slots);
    }

    /**
     * Get slots by date.
     * GET /api/v1/appointment-slots/date/{date}
     *
     * @param string $date (YYYY-MM-DD)
     * @param Request $request
     * @return ResourceCollection
     */
    public function byDate(string $date, Request $request): ResourceCollection
    {
        $garageUuid = $request->input('garage_uuid');
        $limit = $request->input('limit', 50);

        $query = AppointmentSlot::onDate($date);

        if ($garageUuid) {
            $query->forGarage($garageUuid);
        }

        $query->ordered();

        $slots = $query->paginate($limit);

        return AppointmentSlotResource::collection($slots);
    }

    /**
     * Bulk create appointment slots for a garage.
     * POST /api/v1/appointment-slots/bulk-create
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function bulkCreate(Request $request)
    {
        $validated = $request->validate([
            'garage_uuid'  => 'required|uuid|exists:garages,uuid',
            'date'         => 'required|date_format:Y-m-d',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'interval_minutes' => 'nullable|integer|default:30',
            'max_capacity' => 'nullable|integer|default:1',
        ]);

        $slots = [];
        $startTime = \DateTime::createFromFormat('H:i', $validated['start_time']);
        $endTime = \DateTime::createFromFormat('H:i', $validated['end_time']);
        $interval = $validated['interval_minutes'];

        while ($startTime < $endTime) {
            $slot = AppointmentSlot::create([
                'garage_uuid'      => $validated['garage_uuid'],
                'date'             => $validated['date'],
                'time'             => $startTime->format('H:i'),
                'duration_minutes' => $interval,
                'max_capacity'     => $validated['max_capacity'],
                'booked_count'     => 0,
                'is_available'     => true,
            ]);

            $slots[] = new AppointmentSlotResource($slot);
            $startTime->modify("+{$interval} minutes");
        }

        return response()->json([
            'message' => "Created " . count($slots) . " appointment slots",
            'slots'   => $slots,
        ], 201);
    }
}