<?php

namespace Fleetbase\FleetOps\Models;

use Fleetbase\Models\Model;
use Fleetbase\Traits\HasApiModelBehavior;
use Fleetbase\Traits\HasPublicId;
use Fleetbase\Traits\HasUuid;
use Fleetbase\Traits\TracksApiCredential;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class MaintenanceItem
 *
 * Modèle représentant un produit sélectionné pour une demande de maintenance
 * C'est un lien entre MaintenanceRequest et RepairProduct
 */
class MaintenanceItem extends Model
{
    use HasUuid;
    use HasPublicId;
    use TracksApiCredential;
    use HasApiModelBehavior;
    use LogsActivity;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'maintenance_items';

    /**
     * The type of public Id to generate.
     *
     * @var string
     */
    protected $publicIdType = 'item';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'maintenance_request_uuid',
        'repair_product_uuid',
        'product_name',
        'product_sku',
        'quantity',
        'unit_price_mad',
        'total_price_mad',
        'currency',
    ];

    /**
     * Dynamic attributes that are appended to object.
     *
     * @var array
     */
    protected $appends = [
        'formatted_total_price',
        'formatted_unit_price',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'quantity'           => 'integer',
        'unit_price_mad'     => 'decimal:2',
        'total_price_mad'    => 'decimal:2',
    ];

    /**
     * Properties which activity needs to be logged.
     *
     * @var array
     */
    protected static $logAttributes = ['quantity', 'unit_price_mad', 'total_price_mad'];

    /**
     * Do not log empty changed.
     *
     * @var bool
     */
    protected static $submitEmptyLogs = false;

    /**
     * The name of the subject to log.
     *
     * @var string
     */
    protected static $logName = 'maintenance_item';

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnly(static::$logAttributes);
    }

    /**
     * Relation: Un item appartient à une demande de maintenance.
     */
    public function maintenanceRequest(): BelongsTo
    {
        return $this->belongsTo(
            MaintenanceRequest::class,
            'maintenance_request_uuid',
            'uuid'
        );
    }

    /**
     * Relation: Un item correspond à un produit.
     */
    public function repairProduct(): BelongsTo
    {
        return $this->belongsTo(
            RepairProduct::class,
            'repair_product_uuid',
            'uuid'
        );
    }

    /**
     * Obtenir le prix total formaté.
     */
    public function getFormattedTotalPriceAttribute(): string
    {
        return number_format($this->total_price_mad, 2, '.', ' ') . ' ' . $this->currency;
    }

    /**
     * Obtenir le prix unitaire formaté.
     */
    public function getFormattedUnitPriceAttribute(): string
    {
        return number_format($this->unit_price_mad, 2, '.', ' ') . ' ' . $this->currency;
    }

    /**
     * Calculer le prix total basé sur quantité et prix unitaire.
     */
    public static function calculateTotal(float $unitPrice, int $quantity): float
    {
        return round($unitPrice * $quantity, 2);
    }

    /**
     * Scope pour filtrer par demande de maintenance.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $maintenanceRequestUuid
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForMaintenance($query, string $maintenanceRequestUuid)
    {
        return $query->where('maintenance_request_uuid', $maintenanceRequestUuid);
    }

    /**
     * Scope pour filtrer par produit.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $repairProductUuid
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForProduct($query, string $repairProductUuid)
    {
        return $query->where('repair_product_uuid', $repairProductUuid);
    }

    /**
     * Mettre à jour la quantité et recalculer le total.
     *
     * @param int $quantity
     * @return bool
     */
    public function updateQuantity(int $quantity): bool
    {
        $this->quantity = $quantity;
        $this->total_price_mad = self::calculateTotal($this->unit_price_mad, $quantity);

        return $this->save();
    }
}