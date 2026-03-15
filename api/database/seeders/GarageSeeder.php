<?php

namespace Database\Seeders;

use Fleetbase\FleetOps\Models\Garage;
use Illuminate\Database\Seeder;

class GarageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companyUuid = env('SEED_COMPANY_UUID', 'default-company-uuid');

        $garages = [
            [
                'name'             => 'SPA CLEAN CAR',
                'description'      => 'Centre de nettoyage et de maintenance automobile',
                'phone'            => '+212 5 22 12 34 56',
                'email'            => 'contact@spacleancar.com',
                'address'          => '123 Boulevard de la Corniche',
                'city'             => 'Casablanca',
                'latitude'         => 33.5731,
                'longitude'        => -7.5898,
                'base_price_mad'   => 100.00,
                'services_offered' => json_encode(['nettoyage', 'vidange', 'diagnostic']),
                'rating'           => 4.5,
                'working_hours_start' => '08:00',
                'working_hours_end'   => '18:00',
            ],
            [
                'name'             => 'SILVER AUTO SERVICE',
                'description'      => 'Atelier spécialisé en maintenance générale et freinage',
                'phone'            => '+212 5 22 23 45 67',
                'email'            => 'service@silverauto.ma',
                'address'          => '456 Rue Mohammed V',
                'city'             => 'Casablanca',
                'latitude'         => 33.5733,
                'longitude'        => -7.5899,
                'base_price_mad'   => 160.00,
                'services_offered' => json_encode(['vidange', 'freinage', 'suspension', 'électrique']),
                'rating'           => 4.8,
                'working_hours_start' => '07:30',
                'working_hours_end'   => '19:30',
            ],
            [
                'name'             => 'HORD AUTO SERVICES BELVEDERE',
                'description'      => 'Garage polyvalent toutes marques, garantie pièces',
                'phone'            => '+212 5 22 34 56 78',
                'email'            => 'info@hordauto.com',
                'address'          => '789 Avenue Hassan II, Belvedere',
                'city'             => 'Casablanca',
                'latitude'         => 33.5735,
                'longitude'        => -7.5900,
                'base_price_mad'   => 0.00,
                'services_offered' => json_encode(['mécanique_générale', 'carrosserie', 'peinture', 'électricité']),
                'rating'           => 4.2,
                'working_hours_start' => '09:00',
                'working_hours_end'   => '17:00',
            ],
            [
                'name'             => 'DABA PNEU AIN SEBAA',
                'description'      => 'Spécialiste pneus et alignement roues',
                'phone'            => '+212 5 22 45 67 89',
                'email'            => 'pneus@daba-ainsebaa.com',
                'address'          => '321 Route Ain Sebaa',
                'city'             => 'Casablanca',
                'latitude'         => 33.5737,
                'longitude'        => -7.5901,
                'base_price_mad'   => 120.00,
                'services_offered' => json_encode(['pneus', 'alignement', 'équilibrage']),
                'rating'           => 4.6,
                'working_hours_start' => '08:00',
                'working_hours_end'   => '18:30',
            ],
            [
                'name'             => 'AUTO TECH MAROC',
                'description'      => 'Centre technique automobile avec équipements modernes',
                'phone'            => '+212 5 22 56 78 90',
                'email'            => 'tech@autotech-maroc.com',
                'address'          => '654 Rue Sidi Belyout',
                'city'             => 'Casablanca',
                'latitude'         => 33.5739,
                'longitude'        => -7.5902,
                'base_price_mad'   => 185.00,
                'services_offered' => json_encode(['diagnostic', 'réparation_moteur', 'boîte_vitesses', 'climatisation']),
                'rating'           => 4.7,
                'working_hours_start' => '07:00',
                'working_hours_end'   => '19:00',
            ],
            [
                'name'             => 'GARAGE ESSAADA',
                'description'      => 'Réparation toutes marques, pièces d\'origine et compatibles',
                'phone'            => '+212 5 22 67 89 01',
                'email'            => 'info@garage-essaada.com',
                'address'          => '987 Boulevard Zaid Senhaji',
                'city'             => 'Casablanca',
                'latitude'         => 33.5741,
                'longitude'        => -7.5903,
                'base_price_mad'   => 140.00,
                'services_offered' => json_encode(['mécanique', 'carrosserie', 'peinture']),
                'rating'           => 4.3,
                'working_hours_start' => '08:30',
                'working_hours_end'   => '18:30',
            ],
            [
                'name'             => 'PRECISION AUTO PARTS',
                'description'      => 'Atelier spécialisé dans les petites réparations et pièces de rechange',
                'phone'            => '+212 5 22 78 90 12',
                'email'            => 'support@precision-auto.ma',
                'address'          => '555 Avenue Lalla Yacout',
                'city'             => 'Casablanca',
                'latitude'         => 33.5743,
                'longitude'        => -7.5904,
                'base_price_mad'   => 75.00,
                'services_offered' => json_encode(['pièces_rechange', 'réparations_mineures']),
                'rating'           => 4.1,
                'working_hours_start' => '09:00',
                'working_hours_end'   => '17:30',
            ],
            [
                'name'             => 'MASTER GARAGE CASABLANCA',
                'description'      => 'Grand garage avec service complet et pièces toutes marques',
                'phone'            => '+212 5 22 89 01 23',
                'email'            => 'master@mastergarage.com',
                'address'          => '222 Rue Driss El Harti',
                'city'             => 'Casablanca',
                'latitude'         => 33.5745,
                'longitude'        => -7.5905,
                'base_price_mad'   => 200.00,
                'services_offered' => json_encode(['service_complet', 'électrique_automobile', 'clim', 'diagnotic_multi_marques']),
                'rating'           => 4.9,
                'working_hours_start' => '07:00',
                'working_hours_end'   => '20:00',
            ],
        ];

        foreach ($garages as $garage) {
            Garage::create([
                'company_uuid'         => $companyUuid,
                'name'                 => $garage['name'],
                'description'          => $garage['description'],
                'phone'                => $garage['phone'],
                'email'                => $garage['email'],
                'address'              => $garage['address'],
                'city'                 => $garage['city'],
                'latitude'             => $garage['latitude'],
                'longitude'            => $garage['longitude'],
                'base_price_mad'       => $garage['base_price_mad'],
                'currency'             => 'MAD',
                'services_offered'     => $garage['services_offered'],
                'is_active'            => true,
                'rating'               => $garage['rating'],
                'working_hours_start'  => $garage['working_hours_start'],
                'working_hours_end'    => $garage['working_hours_end'],
            ]);
        }

        $this->command->info('✅ ' . count($garages) . ' garages créés!');
    }
}