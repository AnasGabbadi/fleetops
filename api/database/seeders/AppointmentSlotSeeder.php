<?php

namespace Database\Seeders;

use Fleetbase\FleetOps\Models\Garage;
use Fleetbase\FleetOps\Models\AppointmentSlot;
use Illuminate\Database\Seeder;

class AppointmentSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $garages = Garage::all();

        if ($garages->isEmpty()) {
            $this->command->warn('⚠️  Aucun garage trouvé. Exécutez GarageSeeder d\'abord!');
            return;
        }

        $startDate = now()->addDay();
        $endDate = now()->addDays(14);
        $slotsCreated = 0;

        // Créneaux horaires (09:00 à 17:00, par intervalles de 30 minutes)
        $timeSlots = $this->generateTimeSlots('09:00', '17:00', 30);

        // Pour chaque garage
        foreach ($garages as $garage) {
            // Pour chaque jour dans la plage de dates
            $currentDate = $startDate->copy();
            while ($currentDate <= $endDate) {
                // Sauter les dimanche (0 = dimanche)
                if ($currentDate->dayOfWeek != 0) {
                    // Pour chaque créneau horaire
                    foreach ($timeSlots as $time) {
                        AppointmentSlot::create([
                            'garage_uuid'      => $garage->uuid,
                            'date'             => $currentDate->format('Y-m-d'),
                            'time'             => $time,
                            'duration_minutes' => 60,
                            'max_capacity'     => 2,
                            'booked_count'     => 0,
                            'is_available'     => true,
                        ]);
                        $slotsCreated++;
                    }
                }
                $currentDate->addDay();
            }
        }

        $this->command->info("✅ {$slotsCreated} créneaux de rendez-vous créés!");
    }

    /**
     * Generate time slots between start and end time with given interval.
     *
     * @param string $startTime (HH:MM)
     * @param string $endTime (HH:MM)
     * @param int $intervalMinutes
     * @return array
     */
    private function generateTimeSlots(string $startTime, string $endTime, int $intervalMinutes): array
    {
        $slots = [];
        $start = \DateTime::createFromFormat('H:i', $startTime);
        $end = \DateTime::createFromFormat('H:i', $endTime);

        while ($start <= $end) {
            $slots[] = $start->format('H:i');
            $start->modify("+{$intervalMinutes} minutes");
        }

        return $slots;
    }
}