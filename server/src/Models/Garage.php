<?php

namespace Fleetbase\FleetOps\Models;

use Fleetbase\Casts\Json;
use Fleetbase\Models\Model;
use Fleetbase\Traits\HasApiModelBehavior;
use Fleetbase\Traits\HasCustomFields;
use Fleetbase\Traits\HasMetaAttributes;
use Fleetbase\Traits\HasPublicId;
use Fleetbase\Traits\HasUuid;
use Fleetbase\Traits\Searchable;
use Fleetbase\Traits\TracksApiCredential;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class Garage
 *
 * Modèle représentant un garage/atelier pouvant effectuer des maintenances
 */
class Garage extends Model
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
    protected $table = 'garages';

    /**
     * The type of public Id to generate.
     *
     * @var string
     */
    protected $publicIdType = 'garage';

    /**
     * The attributes that can be queried.
     *
     * @var array
     */
    protected $searchableColumns = ['name', 'city', 'phone', 'email', 'address', 'public_id'];

    /**
     * The attributes that can be used for filtering.
     *
     * @var array
     */
    protected $filterParams = ['city', 'is_active', 'company_uuid'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_uuid',
        'name',
        'description',
        'phone',
        'email',
        'address',
        'city',
        'latitude',
        'longitude',
        'base_price_mad',
        'currency',
        'services_offered',
        'is_active',
        'api_reference',
        'working_hours_start',
        'working_hours_end',
        'rating',
        'meta',
    ];

    /**
     * Dynamic attributes that are appended to object.
     *
     * @var array
     */
    protected $appends = [
        'working_hours',
        'available_slots_count',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['appointmentSlots'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'base_price_mad'     => 'decimal:2',
        'rating'             => 'decimal:2',
        'latitude'           => 'decimal:8',
        'longitude'          => 'decimal:8',
        'is_active'          => 'boolean',
        'services_offered'   => Json::class,
        'meta'               => Json::class,
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
    protected static $logName = 'garage';

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll();
    }

    /**
     * Relation: Un garage a plusieurs créneaux disponibles.
     */
    public function appointmentSlots(): HasMany
    {
        return $this->hasMany(AppointmentSlot::class, 'garage_uuid', 'uuid');
    }

    /**
     * Relation: Un garage a plusieurs demandes de maintenance.
     */
    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class, 'garage_uuid', 'uuid');
    }

    /**
     * Obtenir les heures de travail formatées.
     */
    public function getWorkingHoursAttribute(): array
    {
        return [
            'start' => $this->working_hours_start,
            'end'   => $this->working_hours_end,
        ];
    }

    /**
     * Obtenir le nombre de créneaux disponibles.
     */
    public function getAvailableSlotsCountAttribute(): int
    {
        return $this->appointmentSlots()
            ->where('is_available', true)
            ->count();
    }

    /**
     * Scope pour récupérer les garages actifs.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour filtrer par ville.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $city
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    /**
     * Scope pour filtrer par service offert.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $service
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfferingService($query, string $service)
    {
        return $query->whereJsonContains('services_offered', $service);
    }

    /**
     * Scope pour les garages avec les meilleures notes.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTopRated($query)
    {
        return $query->orderByDesc('rating');
    }

    /**
     * Vérifier si le garage offre un service.
     *
     * @param string $service
     * @return bool
     */
    public function offersService(string $service): bool
    {
        return in_array($service, $this->services_offered ?? []);
    }

    /**
     * Vérifier si le garage est ouvert à une heure donnée.
     *
     * @param \DateTime $dateTime
     * @return bool
     */
    public function isOpenAt(\DateTime $dateTime): bool
    {
        $time = $dateTime->format('H:i');
        
        return $time >= $this->working_hours_start && $time <= $this->working_hours_end;
    }

    /**
     * Obtenir les créneaux disponibles pour une date donnée.
     *
     * @param string $date (YYYY-MM-DD)
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAvailableSlotsForDate(string $date)
    {
        return $this->appointmentSlots()
            ->where('date', $date)
            ->where('is_available', true)
            ->orderBy('time')
            ->get();
    }

    /**
     * Formater le prix pour affichage.
     *
     * @return string
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->base_price_mad, 2, '.', ' ') . ' ' . $this->currency;
    }

    /**
     * Obtenir les coordonnées si disponibles.
     *
     * @return array|null
     */
    public function getCoordinatesAttribute(): ?array
    {
        if ($this->latitude && $this->longitude) {
            return [
                'latitude'  => $this->latitude,
                'longitude' => $this->longitude,
            ];
        }

        return null;
    }
}