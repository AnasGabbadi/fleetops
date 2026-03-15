<?php

namespace Fleetbase\FleetOps\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GarageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'uuid'                  => $this->uuid,
            'public_id'             => $this->public_id,
            'name'                  => $this->name,
            'description'           => $this->description,
            'phone'                 => $this->phone,
            'email'                 => $this->email,
            'address'               => $this->address,
            'city'                  => $this->city,
            'latitude'              => $this->latitude ? (float) $this->latitude : null,
            'longitude'             => $this->longitude ? (float) $this->longitude : null,
            'coordinates'           => $this->getCoordinatesAttribute(),
            'base_price_mad'        => (float) $this->base_price_mad,
            'currency'              => $this->currency ?? 'MAD',
            'formatted_price'       => $this->getFormattedPriceAttribute(),
            'services_offered'      => $this->services_offered ?? [],
            'is_active'             => (bool) $this->is_active,
            'working_hours'         => $this->getWorkingHoursAttribute(),
            'working_hours_start'   => $this->working_hours_start,
            'working_hours_end'     => $this->working_hours_end,
            'rating'                => $this->rating ? (float) $this->rating : null,
            'available_slots_count' => $this->available_slots_count,
            'api_reference'         => $this->api_reference,
            'created_at'            => $this->created_at?->toIso8601String(),
            'updated_at'            => $this->updated_at?->toIso8601String(),
        ];
    }
}