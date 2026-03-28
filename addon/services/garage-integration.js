import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GarageIntegrationService extends Service {
  @service fetch;
  @tracked garages = [];
  @tracked isLoading = false;
  @tracked error = null;
  @tracked citiesList = [];

  fakeTimes = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'
  ];

  @action
  async loadGarages() {
    this.isLoading = true;
    try {
      const response = await this.fetch.get('garages', { limit: 100 });
      const garages = response.garages || [];
      this.garages = garages.map(g => ({
        id: g.uuid,
        uuid: g.uuid,
        name: g.name,
        description: g.description,
        phone: g.phone,
        address: g.address,
        city: g.city,
        basePriceMad: g.base_price_mad || 0,
        formattedPrice: g.base_price_mad ? `${g.base_price_mad} MAD` : 'Gratuit',
        rating: g.rating || 0,
        formattedRating: g.rating ? `${g.rating}/5` : 'N/A',
        workingHoursStart: g.working_hours_start || '08:00',
        workingHoursEnd: g.working_hours_end || '18:00',
        servicesOffered: g.services_offered || [],
        isActive: g.is_active,
      }));
      this.citiesList = [...new Set(this.garages.map(g => g.city))].sort();
    } catch (e) {
      this.error = e;
    } finally {
      this.isLoading = false;
    }
  }

  @action
  async loadAvailableSlotsForDate(garageUuid, date) {
    await new Promise(r => setTimeout(r, 200));
    return this.fakeTimes.map((time, index) => ({
      id: `slot-${garageUuid}-${date}-${index}`,
      uuid: `slot-${garageUuid}-${date}-${index}`,
      garageUuid,
      date,
      time,
      isAvailable: true,
      canBook: true,
      bookedCount: 0,
      maxCapacity: 1,
    }));
  }

  @action setCity(city) { this._city = city; }
  @action setSortBy(sort) { this._sort = sort; }
}
