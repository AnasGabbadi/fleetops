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
        Schema::create('appointment_slots', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique()->index();
            
            // Relation au garage
            $table->uuid('garage_uuid')->index();
            $table->foreign('garage_uuid')
                  ->references('uuid')
                  ->on('garages')
                  ->onDelete('cascade');
            
            // Date et heure
            $table->date('date')->index();
            $table->time('time');
            
            // Capacité et réservations
            $table->integer('duration_minutes')->default(60);
            $table->integer('max_capacity')->default(1);
            $table->integer('booked_count')->default(0);
            $table->boolean('is_available')->default(true)->index();
            
            // Intégration API externe
            $table->string('api_reference', 255)->nullable();
            
            // Métadonnées
            $table->json('meta')->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes composites
            $table->index(['garage_uuid', 'date']);
            $table->index(['date', 'is_available']);
            $table->index(['garage_uuid', 'date', 'time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_slots');
    }
};
