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
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique()->index();
            $table->string('public_id', 50)->unique()->index(); // MNT-2025-0001
            
            // Relations
            $table->uuid('company_uuid')->index();
            $table->uuid('user_uuid')->index(); // Utilisateur qui crée la demande
            $table->uuid('vehicle_uuid')->index();
            $table->uuid('garage_uuid')->nullable()->index();
            $table->uuid('appointment_slot_uuid')->nullable()->index();

            // Type et statut
            $table->string('maintenance_type', 100); // vidange_complet, diagnostic, etc
            $table->string('status', 50)->default('pending')->index(); // pending, confirmed, in_progress, completed, cancelled, paid
            $table->string('priority', 20)->default('medium'); // low, medium, high, critical
            
            // Localisation
            $table->string('city', 100)->index();
            $table->string('address', 500)->nullable();
            
            // Coûts en MAD
            $table->decimal('total_products_cost_mad', 10, 2)->default(0);
            $table->decimal('garage_service_cost_mad', 10, 2)->default(0);
            $table->decimal('subtotal_mad', 10, 2)->default(0);
            $table->decimal('tax_mad', 10, 2)->default(0);
            $table->decimal('discount_mad', 10, 2)->default(0);
            $table->decimal('total_cost_mad', 10, 2)->default(0);
            $table->string('currency', 3)->default('MAD');
            
            // Messages
            $table->text('customer_message')->nullable();
            $table->text('notes')->nullable();
            
            // Données
            $table->json('attachments')->nullable();
            $table->json('line_items')->nullable(); // Copie des produits au moment de création
            
            // Dates
            $table->date('scheduled_date')->index();
            $table->time('scheduled_time');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            // Paiement
            $table->string('payment_status', 50)->default('pending')->index(); // pending, partial, completed
            $table->string('payment_method', 50)->nullable(); // cash, card, check, etc
            $table->string('payment_reference', 255)->nullable();
            $table->timestamp('paid_at')->nullable();
            
            // Audit
            $table->uuid('created_by_uuid')->nullable();
            $table->uuid('updated_by_uuid')->nullable();
            
            // Métadonnées
            $table->json('meta')->nullable();
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes composites
            $table->index(['company_uuid', 'status']);
            $table->index(['company_uuid', 'created_at']);
            $table->index(['vehicle_uuid', 'status']);
            $table->index(['status', 'payment_status']);
            $table->index(['scheduled_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_requests');
    }
};
