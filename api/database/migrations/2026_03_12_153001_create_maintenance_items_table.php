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
        Schema::create('maintenance_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('uuid')->unique()->index();
            
            // Relations
            $table->uuid('maintenance_request_uuid')->index();
            $table->uuid('repair_product_uuid')->index();
            
            // Détails du produit (snapshot au moment de la création)
            $table->string('product_name', 255);
            $table->string('product_sku', 100);
            
            // Quantité et prix
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price_mad', 10, 2);
            $table->decimal('total_price_mad', 10, 2);
            $table->string('currency', 3)->default('MAD');
            
            // Timestamps
            $table->timestamps();
            
            // Indexes composites
            $table->index(['maintenance_request_uuid', 'repair_product_uuid'], 'idx_maint_item_request_product');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_items');
    }
};
