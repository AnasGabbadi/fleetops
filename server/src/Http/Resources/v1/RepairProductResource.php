<?php

namespace Fleetbase\FleetOps\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepairProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'uuid'              => $this->uuid,
            'public_id'         => $this->public_id,
            'name'              => $this->name,
            'description'       => $this->description,
            'category'          => $this->category,
            'sku'               => $this->sku,
            'price_mad'         => (float) $this->price_mad,
            'currency'          => $this->currency ?? 'MAD',
            'stock_quantity'    => $this->stock_quantity,
            'is_in_stock'       => $this->is_in_stock,
            'is_active'         => (bool) $this->is_active,
            'api_reference'     => $this->api_reference,
            'formatted_price'   => $this->getFormattedPriceAttribute(),
            'created_at'        => $this->created_at?->toIso8601String(),
            'updated_at'        => $this->updated_at?->toIso8601String(),
        ];
    }
}