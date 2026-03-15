<?php

namespace Database\Seeders;

use Fleetbase\FleetOps\Models\RepairProduct;
use Illuminate\Database\Seeder;

class RepairProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companyUuid = env('SEED_COMPANY_UUID', 'default-company-uuid');

        $products = [
            [
                'name'        => 'Filtre à carburant',
                'description' => 'Filtre de carburant haute performance',
                'category'    => 'Filtres',
                'sku'         => 'CFI10659',
                'price_mad'   => 164.00,
                'stock_quantity' => 50,
            ],
            [
                'name'        => 'Filtre à carburant Premium',
                'description' => 'Filtre carburant premium pour moteurs diesel',
                'category'    => 'Filtres',
                'sku'         => 'KX338/260',
                'price_mad'   => 159.75,
                'stock_quantity' => 45,
            ],
            [
                'name'        => 'Filtre à air habitacle',
                'description' => 'Filtre d\'habitacle anti-pollen et anti-pollution',
                'category'    => 'Filtres',
                'sku'         => '715746',
                'price_mad'   => 111.00,
                'stock_quantity' => 60,
            ],
            [
                'name'        => 'Filtre à air moteur',
                'description' => 'Filtre à air moteur haute efficacité',
                'category'    => 'Filtres',
                'sku'         => 'AF5500',
                'price_mad'   => 89.50,
                'stock_quantity' => 70,
            ],

            // Fluides & Additifs
            [
                'name'        => 'Substance étanchéisante',
                'description' => 'Substance étanchéisante pour joints moteur',
                'category'    => 'Fluides',
                'sku'         => '4937287',
                'price_mad'   => 807.00,
                'stock_quantity' => 25,
            ],
            [
                'name'        => 'Huile moteur 5W40',
                'description' => 'Huile moteur synthétique 5W40 premium',
                'category'    => 'Huiles',
                'sku'         => 'HM5W40-5L',
                'price_mad'   => 450.00,
                'stock_quantity' => 35,
            ],
            [
                'name'        => 'Huile de transmission',
                'description' => 'Huile de transmission automatique',
                'category'    => 'Huiles',
                'sku'         => 'HT-ATF-4L',
                'price_mad'   => 480.00,
                'stock_quantity' => 30,
            ],
            [
                'name'        => 'Liquide de refroidissement',
                'description' => 'Liquide de refroidissement antigivrant et anti-corrosion',
                'category'    => 'Fluides',
                'sku'         => 'LR-ECO-1L',
                'price_mad'   => 65.00,
                'stock_quantity' => 80,
            ],
            [
                'name'        => 'Liquide de frein',
                'description' => 'Liquide de frein DOT 4 haute performance',
                'category'    => 'Fluides',
                'sku'         => 'LF-DOT4-0.5L',
                'price_mad'   => 125.00,
                'stock_quantity' => 50,
            ],

            // Pièces d'usure
            [
                'name'        => 'Plaquettes de frein avant',
                'description' => 'Ensemble de plaquettes de frein avant premium',
                'category'    => 'Freins',
                'sku'         => 'PF-AVANT-SET',
                'price_mad'   => 350.00,
                'stock_quantity' => 40,
            ],
            [
                'name'        => 'Plaquettes de frein arrière',
                'description' => 'Ensemble de plaquettes de frein arrière OEM',
                'category'    => 'Freins',
                'sku'         => 'PF-ARRIERE-SET',
                'price_mad'   => 280.00,
                'stock_quantity' => 35,
            ],
            [
                'name'        => 'Disques de frein ventilés',
                'description' => 'Disques de frein ventilés haute performance (paire)',
                'category'    => 'Freins',
                'sku'         => 'DF-VENTI-PAIR',
                'price_mad'   => 520.00,
                'stock_quantity' => 20,
            ],
            [
                'name'        => 'Courroie de distribution',
                'description' => 'Courroie de distribution renforcée',
                'category'    => 'Moteur',
                'sku'         => 'CD-RENFORCEE',
                'price_mad'   => 890.00,
                'stock_quantity' => 15,
            ],
            [
                'name'        => 'Bougies d\'allumage',
                'description' => 'Ensemble de 4 bougies d\'allumage iridium',
                'category'    => 'Électrique',
                'sku'         => 'BA-IRIDIUM-4',
                'price_mad'   => 220.00,
                'stock_quantity' => 45,
            ],

            // Pneus & Batterie
            [
                'name'        => 'Batterie 60Ah',
                'description' => 'Batterie de démarrage 60Ah 540A',
                'category'    => 'Électrique',
                'sku'         => 'BATT-60AH',
                'price_mad'   => 650.00,
                'stock_quantity' => 25,
            ],
            [
                'name'        => 'Alternateur',
                'description' => 'Alternateur 120A renforcé',
                'category'    => 'Électrique',
                'sku'         => 'ALT-120A',
                'price_mad'   => 1250.00,
                'stock_quantity' => 10,
            ],
        ];

        foreach ($products as $product) {
            RepairProduct::create([
                'company_uuid' => $companyUuid,
                'name'         => $product['name'],
                'description'  => $product['description'],
                'category'     => $product['category'],
                'sku'          => $product['sku'],
                'price_mad'    => $product['price_mad'],
                'currency'     => 'MAD',
                'stock_quantity' => $product['stock_quantity'],
                'is_active'    => true,
            ]);
        }

        $this->command->info('✅ ' . count($products) . ' produits de réparation créés!');
    }
}