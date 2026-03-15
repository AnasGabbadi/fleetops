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
        Schema::table('fleets', function (Blueprint $table) {
            // Niveau hiérarchique de la flotte
            $table->enum('fleet_level', ['PAYS', 'VILLE', 'ZONE'])->nullable()->default('ZONE')->after('status');
            
            // Pays
            $table->string('country')->nullable()->after('fleet_level');
            
            // Ville
            $table->string('city')->nullable()->after('country');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fleets', function (Blueprint $table) {
            $table->dropColumn(['fleet_level', 'country', 'city']);
        });
    }
};
