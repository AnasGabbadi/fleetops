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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->char('fleet_uuid', 36)->nullable()->after('company_uuid')->comment('Flotte/Zone assignée');
            $table->foreign('fleet_uuid')->references('uuid')->on('fleets')->onDelete('set null');
            $table->index('fleet_uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign(['fleet_uuid']);
            $table->dropColumn('fleet_uuid');
        });
    }
};
