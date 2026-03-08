<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;
use DB;

class VehicleSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('vehicles')->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $companyId = DB::table('companies')->first()->uuid ?? null;
        
        if (!$companyId) {
            $this->command->error('Aucune entreprise trouvée.');
            return;
        }

        $vehicles = [
            ['make'=>'Renault','model'=>'Kangoo','year'=>'2021','version'=>'1.5 DCI','color'=>'Blanc','plate_number'=>'12345-A-1','vin'=>'VF1FC0JEF12345001','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>45000,'assurance_expiry'=>'2025-12-31','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-09-15','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Peugeot','model'=>'Partner','year'=>'2020','version'=>'1.6 HDI','color'=>'Gris','plate_number'=>'23456-B-2','vin'=>'VF3GB9HXF23456002','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>62000,'assurance_expiry'=>'2025-11-30','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-08-20','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Toyota','model'=>'Hilux','year'=>'2022','version'=>'2.4 D4D','color'=>'Blanc','plate_number'=>'34567-C-3','vin'=>'AHTFR22G234567003','fuel_type'=>'diesel','body_type'=>'pickup','ownership_type'=>'company','status'=>'active','odometer'=>28000,'assurance_expiry'=>'2026-03-31','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2026-02-10','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Ford','model'=>'Transit','year'=>'2019','version'=>'2.0 TDCi','color'=>'Blanc','plate_number'=>'45678-D-4','vin'=>'WF0XXXTTGXKJ45678','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>95000,'assurance_expiry'=>'2025-10-31','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-07-05','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Mercedes-Benz','model'=>'Sprinter','year'=>'2021','version'=>'2.2 CDI','color'=>'Blanc','plate_number'=>'56789-E-5','vin'=>'WDB9066331S567890','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>38000,'assurance_expiry'=>'2026-01-31','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-11-20','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Dacia','model'=>'Duster','year'=>'2022','version'=>'1.5 DCI 4x4','color'=>'Rouge','plate_number'=>'67890-F-6','vin'=>'UU1HSDB9H678900006','fuel_type'=>'diesel','body_type'=>'suv','ownership_type'=>'company','status'=>'active','odometer'=>21000,'assurance_expiry'=>'2026-02-28','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2026-01-15','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Hyundai','model'=>'Tucson','year'=>'2020','version'=>'2.0 CRDi','color'=>'Bleu','plate_number'=>'78901-G-7','vin'=>'TMAD381AALK789017','fuel_type'=>'diesel','body_type'=>'suv','ownership_type'=>'company','status'=>'active','odometer'=>55000,'assurance_expiry'=>'2025-09-30','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-08-01','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Volkswagen','model'=>'Transporter','year'=>'2021','version'=>'2.0 TDI','color'=>'Argent','plate_number'=>'89012-H-8','vin'=>'WV1ZZZ7HZM890128','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>41000,'assurance_expiry'=>'2025-12-15','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-10-10','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Nissan','model'=>'Navara','year'=>'2019','version'=>'2.3 DCI','color'=>'Noir','plate_number'=>'90123-I-9','vin'=>'VSKFANR32U0901239','fuel_type'=>'diesel','body_type'=>'pickup','ownership_type'=>'company','status'=>'maintenance','odometer'=>88000,'assurance_expiry'=>'2025-08-31','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-06-20','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Fiat','model'=>'Ducato','year'=>'2020','version'=>'2.3 Multijet','color'=>'Blanc','plate_number'=>'01234-J-10','vin'=>'ZFA25000002012340','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>72000,'assurance_expiry'=>'2025-11-15','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-09-01','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Renault','model'=>'Trafic','year'=>'2021','version'=>'1.6 DCI','color'=>'Gris','plate_number'=>'11111-K-11','vin'=>'VF1FL000X11111011','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>33000,'assurance_expiry'=>'2026-01-15','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-12-05','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Citroën','model'=>'Jumpy','year'=>'2020','version'=>'2.0 BlueHDI','color'=>'Blanc','plate_number'=>'22222-L-12','vin'=>'VF7V9YHZCL2222212','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>48000,'assurance_expiry'=>'2025-10-20','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-07-25','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Toyota','model'=>'HiAce','year'=>'2022','version'=>'2.5 D4D','color'=>'Blanc','plate_number'=>'33333-M-13','vin'=>'JTFSX22P100333313','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>19000,'assurance_expiry'=>'2026-04-30','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2026-03-10','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Mitsubishi','model'=>'L200','year'=>'2021','version'=>'2.4 DID','color'=>'Blanc','plate_number'=>'44444-N-14','vin'=>'MMBJNKB40LH444414','fuel_type'=>'diesel','body_type'=>'pickup','ownership_type'=>'company','status'=>'active','odometer'=>36000,'assurance_expiry'=>'2025-12-01','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-11-01','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Kia','model'=>'Sportage','year'=>'2021','version'=>'1.6 CRDi','color'=>'Noir','plate_number'=>'55555-O-15','vin'=>'U5YPH81AAMK555515','fuel_type'=>'diesel','body_type'=>'suv','ownership_type'=>'company','status'=>'active','odometer'=>29000,'assurance_expiry'=>'2026-02-15','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2026-01-20','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Peugeot','model'=>'3008','year'=>'2020','version'=>'2.0 BlueHDI','color'=>'Bleu','plate_number'=>'66666-P-16','vin'=>'VF3MCYHZPK666616','fuel_type'=>'diesel','body_type'=>'suv','ownership_type'=>'company','status'=>'active','odometer'=>51000,'assurance_expiry'=>'2025-09-15','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-08-10','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Renault','model'=>'Kangoo','year'=>'2023','version'=>'1.5 DCI 115','color'=>'Blanc','plate_number'=>'77777-Q-17','vin'=>'VF1FC0JEF77777017','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>8000,'assurance_expiry'=>'2026-05-31','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2026-04-15','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Ford','model'=>'Ranger','year'=>'2022','version'=>'2.0 EcoBlue','color'=>'Gris','plate_number'=>'88888-R-18','vin'=>'WF0FXXTTGFNK888818','fuel_type'=>'diesel','body_type'=>'pickup','ownership_type'=>'company','status'=>'active','odometer'=>24000,'assurance_expiry'=>'2026-03-15','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2026-02-20','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Mercedes-Benz','model'=>'Vito','year'=>'2021','version'=>'2.0 CDI','color'=>'Noir','plate_number'=>'99999-S-19','vin'=>'WDF4470221P999919','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>43000,'assurance_expiry'=>'2025-12-20','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-10-30','carte_grise_expiry'=>'2026-01-01'],
            ['make'=>'Volkswagen','model'=>'Crafter','year'=>'2020','version'=>'2.0 TDI 140','color'=>'Blanc','plate_number'=>'10101-T-20','vin'=>'WV1ZZZ2EZLH101020','fuel_type'=>'diesel','body_type'=>'van','ownership_type'=>'company','status'=>'active','odometer'=>67000,'assurance_expiry'=>'2025-11-01','vignette_expiry'=>'2025-06-30','visite_technique_expiry'=>'2025-09-25','carte_grise_expiry'=>'2026-01-01'],
        ];

        foreach ($vehicles as $vehicle) {
            DB::table('vehicles')->insert([
                'uuid'                    => (string) Str::uuid(),
                'public_id'               => 'vehicle_' . Str::random(10),
                'company_uuid'            => $companyId,
                'make'                    => $vehicle['make'],
                'model'                   => $vehicle['model'],
                'year'                    => $vehicle['year'],
                'version'                 => $vehicle['version'],
                'color'                   => $vehicle['color'],
                'plate_number'            => $vehicle['plate_number'],
                'vin'                     => $vehicle['vin'],
                'fuel_type'               => $vehicle['fuel_type'],
                'body_type'               => $vehicle['body_type'],
                'ownership_type'          => $vehicle['ownership_type'],
                'status'                  => $vehicle['status'],
                'odometer'                => $vehicle['odometer'],
                'odometer_unit'           => 'km',
                'assurance_expiry'        => $vehicle['assurance_expiry'],
                'vignette_expiry'         => $vehicle['vignette_expiry'],
                'visite_technique_expiry' => $vehicle['visite_technique_expiry'],
                'carte_grise_expiry'      => $vehicle['carte_grise_expiry'],
                'currency'                => 'MAD',
                'online'                  => 0,
                'created_at'              => Carbon::now(),
                'updated_at'              => Carbon::now(),
            ]);
        }

        $this->command->info('✅ 20 véhicules créés avec succès !');
    }
}
