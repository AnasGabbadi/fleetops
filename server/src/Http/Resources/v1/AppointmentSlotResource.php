<?php

namespace Fleetbase\FleetOps\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentSlotResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'uuid'               => $this->uuid,
            'public_id'          => $this->public_id,
            'garage_uuid'        => $this->garage_uuid,
            'garage'             => new GarageResource($this->whenLoaded('garage')),
            'date'               => $this->date?->format('Y-m-d'),
            'time'               => $this->time,
            'datetime'           => $this->getDatetimeAttribute()?->format('Y-m-d H:i:s'),
            'display_text'       => $this->getDisplayTextAttribute(),
            'duration_minutes'   => $this->duration_minutes,
            'max_capacity'       => $this->max_capacity,
            'booked_count'       => $this->booked_count,
            'remaining_capacity' => $this->getRemainingCapacityAttribute(),
            'is_available'       => (bool) $this->is_available,
            'is_full'            => $this->isFull(),
            'api_reference'      => $this->api_reference,
            'created_at'         => $this->created_at?->toIso8601String(),
            'updated_at'         => $this->updated_at?->toIso8601String(),
        ];
    }
}