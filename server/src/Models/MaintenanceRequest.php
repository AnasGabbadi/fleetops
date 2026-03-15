<?php

namespace Fleetbase\FleetOps\Models;

use Fleetbase\Casts\Json;
use Fleetbase\Models\Model;
use Fleetbase\Models\User;
use Fleetbase\Traits\HasApiModelBehavior;
use Fleetbase\Traits\HasCustomFields;
use Fleetbase\Traits\HasMetaAttributes;
use Fleetbase\Traits\HasPublicId;
use Fleetbase\Traits\HasUuid;
use Fleetbase\Traits\Searchable;
use Fleetbase\Traits\TracksApiCredential;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class MaintenanceRequest
 *
 * Modèle représentant une demande de maintenance créée via le wizard
 * Relie véhicule, produits, garage, et rendez-vous
 */
class MaintenanceRequest extends Model
{
    use HasUuid;
    use HasPublicId;
    use TracksApiCredential;
    use HasApiModelBehavior;
    use LogsActivity;
    use HasMetaAttributes;
    use Searchable;
    use HasCustomFields;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'maintenance_requests';

    /**
     * The type of public Id to generate.
     *
     * @var string
     */
    protected $publicIdType = 'mnt';

    /**
     * The attributes that can be queried.
     *
     * @var array
     */
    protected $searchableColumns = ['public_id', 'maintenance_type', 'status', 'city', 'notes'];

    /**
     * The attributes that can be used for filtering.
     *
     * @var array
     */
    protected $filterParams = [
        'status',
        'payment_status',
        'maintenance_type',
        'city',
        'vehicle_uuid',
        'garage_uuid',
        'user_uuid',
        'company_uuid',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_uuid',
        'user_uuid',
        'vehicle_uuid',
        'garage_uuid',
        'appointment_slot_uuid',
        'maintenance_type',
        'status',
        'priority',
        'city',
        'address',
        'total_products_cost_mad',
        'garage_service_cost_mad',
        'subtotal_mad',
        'tax_mad',
        'discount_mad',
        'total_cost_mad',
        'currency',
        'customer_message',
        'notes',
        'attachments',
        'line_items',
        'scheduled_date',
        'scheduled_time',
        'started_at',
        'completed_at',
        'paid_at',
        'payment_status',
        'payment_method',
        'payment_reference',
        'meta',
    ];

    /**
     * Dynamic attributes that are appended to object.
     *
     * @var array
     */
    protected $appends = [
        'display_status',
        'display_payment_status',
        'is_overdue',
        'days_until_scheduled',
        'formatted_total_cost',
        'duration_hours',
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
        'total_products_cost_mad' => 'decimal:2',
        'garage_service_cost_mad' => 'decimal:2',
        'subtotal_mad'            => 'decimal:2',
        'tax_mad'                 => 'decimal:2',
        'discount_mad'            => 'decimal:2',
        'total_cost_mad'          => 'decimal:2',
        'line_items'              => Json::class,
        'attachments'             => Json::class,
        'meta'                    => Json::class,
        'scheduled_date'          => 'date',
        'started_at'              => 'datetime',
        'completed_at'            => 'datetime',
        'paid_at'                 => 'datetime',
    ];

    /**
     * Properties which activity needs to be logged.
     *
     * @var array
     */
    protected static $logAttributes = '*';

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
    protected static $logName = 'maintenance_request';

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll();
    }

    /**
     * Relations
     */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_uuid', 'uuid');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_uuid', 'uuid');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_uuid', 'uuid');
    }

    public function garage(): BelongsTo
    {
        return $this->belongsTo(Garage::class, 'garage_uuid', 'uuid');
    }

    public function appointmentSlot(): BelongsTo
    {
        return $this->belongsTo(AppointmentSlot::class, 'appointment_slot_uuid', 'uuid');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MaintenanceItem::class, 'maintenance_request_uuid', 'uuid');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function vehicle()
    {
        return $this->belongsTo(\Fleetbase\FleetOps\Models\Vehicle::class, 'vehicle_uuid', 'uuid');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function maintenanceItems()
    {
        return $this->hasMany(\Fleetbase\FleetOps\Models\MaintenanceItem::class, 'maintenance_request_uuid', 'uuid');
    }


    /**
     * Relation polymorphe vers le véhicule (futur si besoin générique)
     * Pour le moment utiliser vehicle_uuid directement
     */

    /**
     * Appended Attributes
     */

    public function getDisplayStatusAttribute(): string
    {
        $statusMap = [
            'pending'     => 'En attente',
            'confirmed'   => 'Confirmée',
            'in_progress' => 'En cours',
            'completed'   => 'Complétée',
            'paid'        => 'Payée',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    public function getDisplayPaymentStatusAttribute(): string
    {
        $statusMap = [
            'pending'   => 'En attente',
            'partial'   => 'Partielle',
            'completed' => 'Complétée',
        ];

        return $statusMap[$this->payment_status] ?? $this->payment_status;
    }

    public function getIsOverdueAttribute(): bool
    {
        if (!$this->scheduled_date || in_array($this->status, ['completed', 'cancelled'])) {
            return false;
        }

        return now()->isAfter($this->scheduled_date);
    }

    public function getDaysUntilScheduledAttribute(): ?int
    {
        if (!$this->scheduled_date) {
            return null;
        }

        return now()->diffInDays($this->scheduled_date, false);
    }

    public function getFormattedTotalCostAttribute(): string
    {
        return number_format($this->total_cost_mad, 2, '.', ' ') . ' ' . $this->currency;
    }

    public function getDurationHoursAttribute(): ?float
    {
        if ($this->started_at && $this->completed_at) {
            return $this->started_at->diffInHours($this->completed_at);
        }

        return null;
    }

    /**
     * Scopes
     */

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    public function scopeByGarage($query, string $garageUuid)
    {
        return $query->where('garage_uuid', $garageUuid);
    }

    public function scopeByVehicle($query, string $vehicleUuid)
    {
        return $query->where('vehicle_uuid', $vehicleUuid);
    }

    public function scopeByUser($query, string $userUuid)
    {
        return $query->where('user_uuid', $userUuid);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopeOverdue($query)
    {
        return $query->where('scheduled_date', '<', now()->toDateString())
                     ->where('status', '!=', 'completed');
    }

    public function scopeOrderedByLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('scheduled_date', [$startDate, $endDate]);
    }

    /**
     * Methods
     */

    /**
     * Ajouter un produit à la demande.
     */
    public function addItem(string $productUuid, string $productName, string $productSku, 
                            int $quantity, float $unitPrice): MaintenanceItem
    {
        return $this->items()->create([
            'repair_product_uuid' => $productUuid,
            'product_name'        => $productName,
            'product_sku'         => $productSku,
            'quantity'            => $quantity,
            'unit_price_mad'      => $unitPrice,
            'total_price_mad'     => MaintenanceItem::calculateTotal($unitPrice, $quantity),
            'currency'            => 'MAD',
        ]);
    }

    /**
     * Recalculer le total de la demande.
     */
    public function recalculateTotal(): void
    {
        $productsTotal = $this->items->sum('total_price_mad') ?? 0;
        
        $this->total_products_cost_mad = $productsTotal;
        $this->subtotal_mad = $productsTotal + ($this->garage_service_cost_mad ?? 0);
        
        // Calculer le total avec réduction
        $this->total_cost_mad = $this->subtotal_mad + ($this->tax_mad ?? 0) - ($this->discount_mad ?? 0);
        
        $this->save();
    }

    /**
     * Appliquer un code de réduction.
     */
    public function applyDiscount(float $discountAmount): bool
    {
        if ($discountAmount > $this->subtotal_mad) {
            return false;
        }

        $this->discount_mad = $discountAmount;
        $this->total_cost_mad = $this->subtotal_mad + ($this->tax_mad ?? 0) - $discountAmount;

        return $this->save();
    }

    /**
     * Confirmer la demande (passer de pending à confirmed).
     */
    public function confirm(): bool
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'confirmed';

        return $this->save();
    }

    /**
     * Démarrer la maintenance.
     */
    public function startMaintenance(): bool
    {
        if ($this->status !== 'confirmed') {
            return false;
        }

        $this->status = 'in_progress';
        $this->started_at = now();

        return $this->save();
    }

    /**
     * Marquer comme complétée.
     */
    public function complete(array $completionData = []): bool
    {
        if (!in_array($this->status, ['confirmed', 'in_progress'])) {
            return false;
        }

        $this->status = 'completed';
        $this->completed_at = now();

        if (isset($completionData['notes'])) {
            $this->notes = $completionData['notes'];
        }

        return $this->save();
    }

    /**
     * Marquer comme payée.
     */
    public function markAsPaid(string $paymentMethod = 'cash', string $reference = null): bool
    {
        $this->payment_status = 'completed';
        $this->paid_at = now();
        $this->payment_method = $paymentMethod;

        if ($reference) {
            $this->payment_reference = $reference;
        }

        return $this->save();
    }

    /**
     * Annuler la demande.
     */
    public function cancel(string $reason = null): bool
    {
        if ($this->status === 'completed') {
            return false;
        }

        $this->status = 'cancelled';

        if ($reason) {
            $meta = $this->meta ?? [];
            $meta['cancellation_reason'] = $reason;
            $this->meta = $meta;
        }

        return $this->save();
    }

    /**
     * Obtenir le coût total pour affichage.
     */
    public function getCostBreakdown(): array
    {
        return [
            'products'      => $this->total_products_cost_mad ?? 0,
            'garage_service' => $this->garage_service_cost_mad ?? 0,
            'subtotal'      => $this->subtotal_mad ?? 0,
            'tax'           => $this->tax_mad ?? 0,
            'discount'      => $this->discount_mad ?? 0,
            'total'         => $this->total_cost_mad ?? 0,
            'currency'      => $this->currency,
        ];
    }
}