<?php

namespace Fleetbase\FleetOps\Database\Seeders;

use Fleetbase\FleetOps\Models\MaintenanceRequest;
use Fleetbase\FleetOps\Models\Garage;
use Illuminate\Database\Seeder;

class MaintenanceRequestSeeder extends Seeder
{
    public function run(): void
    {
        $companyUuid = env('SEED_COMPANY_UUID', 'default-company-uuid');
        
        // Récupère les vrais UUIDs des garages
        $garages = Garage::all();
        $vehicleUuid = 'ede56f34-ae69-49cb-9b9c-d1b19005599f';

        $maintenances = [
            [
                'vehicle_uuid' => $vehicleUuid,
                'garage_uuid' => $garages[0]->uuid ?? null,
                'maintenance_type' => 'repair',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'city' => 'Casablanca',
                'total_products_cost_mad' => 240.00,
                'garage_service_cost_mad' => 160.00,
                'subtotal_mad' => 400.00,
                'tax_mad' => 80.00,
                'discount_mad' => 0.00,
                'total_cost_mad' => 480.00,
                'currency' => 'MAD',
                'scheduled_date' => now()->addDay(),
                'scheduled_time' => '11:00:00',
                'priority' => 'medium',
            ],
        ];

        foreach ($maintenances as $maintenance) {
            MaintenanceRequest::create([
                'company_uuid' => $companyUuid,
                'user_uuid' => $companyUuid,
                ...$maintenance,
            ]);
        }

        $this->command->info('✅ ' . count($maintenances) . ' maintenances créées!');
    }
}
