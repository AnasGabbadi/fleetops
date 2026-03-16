<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('fleet_vehicles', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('vehicle_uuid');
            $table->timestamp('start_date')->nullable()->after('is_active');
            $table->timestamp('end_date')->nullable()->after('start_date');
            $table->char('assigned_by_uuid', 36)->nullable()->after('end_date');
            $table->longText('notes')->nullable()->after('assigned_by_uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fleet_vehicles', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'start_date', 'end_date', 'assigned_by_uuid', 'notes']);
        });
    }
};
