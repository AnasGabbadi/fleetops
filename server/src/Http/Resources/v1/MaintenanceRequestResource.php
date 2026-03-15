<?php

namespace Fleetbase\FleetOps\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Identifiants
            'id'                    => $this->id,
            'uuid'                  => $this->uuid,
            'public_id'             => $this->public_id,
            
            // Relations principales
            'company_uuid'          => $this->company_uuid,
            'user_uuid'             => $this->user_uuid,
            'vehicle_uuid'          => $this->vehicle_uuid,
            'garage_uuid'           => $this->garage_uuid,
            'appointment_slot_uuid' => $this->appointment_slot_uuid,
            
            // Relations avec ressources
            'garage'                => new GarageResource($this->whenLoaded('garage')),
            'appointment_slot'      => new AppointmentSlotResource($this->whenLoaded('appointmentSlot')),
            'items'                 => MaintenanceItemResource::collection($this->whenLoaded('items')),
            
            // Type et statut
            'maintenance_type'      => $this->maintenance_type,
            'status'                => $this->status,
            'status_label'          => $this->getStatusLabelAttribute(),
            'priority'              => $this->priority,
            'priority_label'        => $this->getPriorityLabelAttribute(),
            
            // Localisation
            'city'                  => $this->city,
            'address'               => $this->address,
            
            // Coûts en MAD
            'total_products_cost_mad'  => (float) $this->total_products_cost_mad,
            'garage_service_cost_mad'  => (float) $this->garage_service_cost_mad,
            'subtotal_mad'             => (float) $this->subtotal_mad,
            'tax_mad'                  => (float) $this->tax_mad,
            'discount_mad'             => (float) $this->discount_mad,
            'total_cost_mad'           => (float) $this->total_cost_mad,
            'currency'                 => $this->currency ?? 'MAD',
            
            // Coûts formatés
            'formatted_products_cost'  => number_format($this->total_products_cost_mad, 2, '.', '') . ' MAD',
            'formatted_service_cost'   => number_format($this->garage_service_cost_mad, 2, '.', '') . ' MAD',
            'formatted_subtotal'       => number_format($this->subtotal_mad, 2, '.', '') . ' MAD',
            'formatted_tax'            => number_format($this->tax_mad, 2, '.', '') . ' MAD',
            'formatted_discount'       => number_format($this->discount_mad, 2, '.', '') . ' MAD',
            'formatted_total'          => number_format($this->total_cost_mad, 2, '.', '') . ' MAD',
            
            // Messages
            'customer_message'      => $this->customer_message,
            'notes'                 => $this->notes,
            'attachments'           => $this->attachments,
            
            // Dates
            'scheduled_date'        => $this->scheduled_date?->format('Y-m-d'),
            'scheduled_time'        => $this->scheduled_time,
            'scheduled_datetime'    => $this->getScheduledDatetimeAttribute()?->format('Y-m-d H:i:s'),
            'started_at'            => $this->started_at?->toIso8601String(),
            'completed_at'          => $this->completed_at?->toIso8601String(),
            
            // Paiement
            'payment_status'        => $this->payment_status,
            'payment_status_label'  => $this->getPaymentStatusLabelAttribute(),
            'payment_method'        => $this->payment_method,
            'payment_reference'     => $this->payment_reference,
            'paid_at'               => $this->paid_at?->toIso8601String(),
            'is_paid'               => $this->isPaid(),
            
            // Décomposition des coûts
            'cost_breakdown'        => $this->getCostBreakdown(),
            
            // Audit
            'created_by_uuid'       => $this->created_by_uuid,
            'updated_by_uuid'       => $this->updated_by_uuid,
            'created_at'            => $this->created_at?->toIso8601String(),
            'updated_at'            => $this->updated_at?->toIso8601String(),
        ];
    }
}