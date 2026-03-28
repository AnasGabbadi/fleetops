<?php

namespace Fleetbase\FleetOps\Http\Resources\v1;

use Fleetbase\Http\Resources\FleetbaseResource;
use Illuminate\Support\Facades\DB;

class MaintenanceRequest extends FleetbaseResource
{
    public function toArray($request)
    {
        $vehicle = $this->vehicle_uuid ? DB::table('vehicles')->where('uuid', $this->vehicle_uuid)->whereNull('deleted_at')->first() : null;
        $garage  = $this->garage_uuid  ? DB::table('garages')->where('uuid', $this->garage_uuid)->whereNull('deleted_at')->first()   : null;

        return array_merge(
            $this->getInternalIds(),
            [
                'id'                      => $this->when(isset($this->public_id), $this->public_id),
                'companyUuid'             => $this->company_uuid,
                'userUuid'                => $this->user_uuid,
                'vehicleUuid'             => $this->vehicle_uuid,
                'garageUuid'              => $this->garage_uuid,
                'appointmentSlotUuid'     => $this->appointment_slot_uuid,
                'maintenanceType'         => $this->maintenance_type,
                'status'                  => $this->status,
                'priority'                => $this->priority ?? 'medium',
                'city'                    => $this->city,
                'address'                 => $this->address,
                'currency'                => $this->currency,
                'notes'                   => $this->notes,
                'totalProductsCostMad'    => $this->total_products_cost_mad,
                'garageServiceCostMad'    => $this->garage_service_cost_mad,
                'subtotalMad'             => $this->subtotal_mad,
                'taxMad'                  => $this->tax_mad,
                'discountMad'             => $this->discount_mad,
                'totalCostMad'            => $this->total_cost_mad,
                'scheduledDate'           => $this->scheduled_date,
                'scheduledTime'           => $this->scheduled_time,
                'paymentStatus'           => $this->payment_status,
                'paymentMethod'           => $this->payment_method,
                'lineItems'               => $this->line_items,
                'meta'                    => $this->meta,
                'vehicleLabel'            => $vehicle ? trim($vehicle->plate_number . ' · ' . $vehicle->make . ' ' . $vehicle->model) : null,
                'garageName'              => $garage?->name ?? null,
                'productsCount'           => DB::table('maintenance_items')->where('maintenance_request_uuid', $this->uuid)->count(),
                'createdAt'               => $this->created_at,
                'updatedAt'               => $this->updated_at,
            ]
        );
    }
}
