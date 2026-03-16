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
        Schema::create('garages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique()->index();
            $table->uuid('company_uuid')->index();
            
            // Informations de base
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 255)->nullable();
            
            // Localisation
            $table->string('address', 500)->nullable();
            $table->string('city', 100)->index();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Tarification
            $table->decimal('base_price_mad', 10, 2);
            $table->string('currency', 3)->default('MAD');
            
            // Services
            $table->json('services_offered')->nullable(); // ["vidange", "diagnostic", ...]
            
            // Statut
            $table->boolean('is_active')->default(true)->index();
            
            // Horaires de travail
            $table->time('working_hours_start')->default('09:00');
            $table->time('working_hours_end')->default('17:30');
            
            // Évaluation
            $table->decimal('rating', 3, 2)->nullable();
            
            // Intégration API externe
            $table->string('api_reference', 255)->nullable();
            
            // Métadonnées
            $table->json('meta')->nullable();
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes composites
            $table->index(['company_uuid', 'is_active']);
            $table->index(['city', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garages');
    }
};
