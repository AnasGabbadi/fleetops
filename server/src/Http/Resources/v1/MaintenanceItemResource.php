<?php

namespace Fleetbase\FleetOps\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceItemResource extends JsonResource
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
            'maintenance_request_uuid' => $this->maintenance_request_uuid,
            'repair_product_uuid'   => $this->repair_product_uuid,
            'product'               => new RepairProductResource($this->whenLoaded('repairProduct')),
            'product_name'          => $this->product_name,
            'product_sku'           => $this->product_sku,
            'quantity'              => $this->quantity,
            'unit_price_mad'        => (float) $this->unit_price_mad,
            'total_price_mad'       => (float) $this->total_price_mad,
            'currency'              => $this->currency ?? 'MAD',
            'formatted_unit_price'  => number_format($this->unit_price_mad, 2, '.', '') . ' MAD',
            'formatted_total_price' => number_format($this->total_price_mad, 2, '.', '') . ' MAD',
            'created_at'            => $this->created_at?->toIso8601String(),
            'updated_at'            => $this->updated_at?->toIso8601String(),
        ];
    }
}