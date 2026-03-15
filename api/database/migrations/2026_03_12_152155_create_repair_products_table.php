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
        Schema::create('repair_products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique()->index();
            $table->uuid('company_uuid')->index();
            
            // Informations produit
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->string('category', 100)->index();
            $table->string('sku', 100)->unique();
            
            // Prix
            $table->decimal('price_mad', 10, 2);
            $table->string('currency', 3)->default('MAD');
            
            // Stock
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_active')->default(true)->index();
            
            // Intégration API externe
            $table->string('api_reference', 255)->nullable();
            
            // Métadonnées
            $table->json('meta')->nullable();
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes composites
            $table->index(['company_uuid', 'is_active']);
            $table->index(['category', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repair_products');
    }
};
