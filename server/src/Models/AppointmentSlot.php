<?php

namespace Fleetbase\FleetOps\Models;

use Fleetbase\Casts\Json;
use Fleetbase\Models\Model;
use Fleetbase\Traits\HasApiModelBehavior;
use Fleetbase\Traits\HasMetaAttributes;
use Fleetbase\Traits\HasPublicId;
use Fleetbase\Traits\HasUuid;
use Fleetbase\Traits\TracksApiCredential;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class AppointmentSlot
 *
 * Modèle représentant un créneau de rendez-vous disponible dans un garage
 */
class AppointmentSlot extends Model
{
    use HasUuid;
    use HasPublicId;
    use TracksApiCredential;
    use HasApiModelBehavior;
    use LogsActivity;
    use HasMetaAttributes;
    use SoftDeletes;
    
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'appointment_slots';

    /**
     * The type of public Id to generate.
     *
     * @var string
     */
    protected $publicIdType = 'slot';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'garage_uuid',
        'date',
        'time',
        'duration_minutes',
        'max_capacity',
        'booked_count',
        'is_available',
        'api_reference',
        'meta',
    ];

    /**
     * Dynamic attributes that are appended to object.
     *
     * @var array
     */
    protected $appends = [
        'datetime',
        'remaining_capacity',
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
        'date'              => 'date',
        'duration_minutes'  => 'integer',
        'max_capacity'      => 'integer',
        'booked_count'      => 'integer',
        'is_available'      => 'boolean',
        'meta'              => Json::class,
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
    protected static $logName = 'appointment_slot';

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll();
    }

    /**
     * Relation: Un créneau appartient à un garage.
     */
    public function garage(): BelongsTo
    {
        return $this->belongsTo(Garage::class, 'garage_uuid', 'uuid');
    }

    /**
     * Relation: Un créneau peut avoir plusieurs rendez-vous.
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class, 'appointment_slot_uuid', 'uuid');
    }

    /**
     * Obtenir le datetime complet du créneau.
     */
    public function getDatetimeAttribute(): \DateTime
    {
        return \DateTime::createFromFormat('Y-m-d H:i', $this->date->format('Y-m-d') . ' ' . $this->time);
    }

    /**
     * Obtenir la capacité restante.
     */
    public function getRemainingCapacityAttribute(): int
    {
        return max(0, $this->max_capacity - $this->booked_count);
    }

    /**
     * Scope pour récupérer les créneaux disponibles.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
                     ->where('booked_count', '<', \DB::raw('max_capacity'));
    }

    /**
     * Scope pour filtrer par garage.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $garageUuid
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForGarage($query, string $garageUuid)
    {
        return $query->where('garage_uuid', $garageUuid);
    }

    /**
     * Scope pour filtrer par date.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $date (YYYY-MM-DD)
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOnDate($query, string $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope pour récupérer les créneaux futurs.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFuture($query)
    {
        return $query->where('date', '>=', now()->toDateString());
    }

    /**
     * Scope pour trier par date et heure.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('date')->orderBy('time');
    }

    /**
     * Vérifier si le créneau est complet.
     */
    public function isFull(): bool
    {
        return $this->booked_count >= $this->max_capacity;
    }

    /**
     * Réserver le créneau.
     */
    public function book(): bool
    {
        if ($this->isFull()) {
            return false;
        }

        $this->booked_count += 1;
        $this->is_available = $this->booked_count < $this->max_capacity;

        return $this->save();
    }

    /**
     * Annuler une réservation du créneau.
     */
    public function cancelBooking(): bool
    {
        if ($this->booked_count <= 0) {
            return false;
        }

        $this->booked_count -= 1;
        $this->is_available = true;

        return $this->save();
    }

    /**
     * Obtenir le créneau au format lisible.
     */
    public function getDisplayTextAttribute(): string
    {
        return $this->time . ' - ' . $this->date->format('d/m/Y');
    }
}