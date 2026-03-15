import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GarageIntegrationService extends Service {
  @tracked garages = [];
  @tracked isLoading = false;
  @tracked error = null;
  @tracked citiesList = [];

  // Fake data garages
  fakeGarages = [
    {
      id: 'garage-1',
      uuid: 'garage-1',
      name: 'SPA CLEAN CAR',
      description: 'Centre de nettoyage et maintenance automobile',
      phone: '+212 5 22 12 34 56',
      address: '123 Boulevard de la Corniche',
      city: 'Casablanca',
      basePriceMad: 100.00,
      formattedPrice: '100.00 MAD',
      rating: 4.5,
      formattedRating: '4.5/5',
      workingHoursStart: '08:00',
      workingHoursEnd: '18:00',
      servicesOffered: ['nettoyage', 'vidange', 'diagnostic'],
      isActive: true,
    },
    {
      id: 'garage-2',
      uuid: 'garage-2',
      name: 'SILVER AUTO SERVICE',
      description: 'Atelier spécialisé en maintenance générale et freinage',
      phone: '+212 5 22 23 45 67',
      address: '456 Rue Mohammed V',
      city: 'Casablanca',
      basePriceMad: 160.00,
      formattedPrice: '160.00 MAD',
      rating: 4.8,
      formattedRating: '4.8/5',
      workingHoursStart: '07:30',
      workingHoursEnd: '19:30',
      servicesOffered: ['vidange', 'freinage', 'suspension'],
      isActive: true,
    },
    {
      id: 'garage-3',
      uuid: 'garage-3',
      name: 'HORD AUTO SERVICES BELVEDERE',
      description: 'Garage polyvalent toutes marques',
      phone: '+212 5 22 34 56 78',
      address: '789 Avenue Hassan II, Belvedere',
      city: 'Casablanca',
      basePriceMad: 0.00,
      formattedPrice: 'Gratuit',
      rating: 4.2,
      formattedRating: '4.2/5',
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      servicesOffered: ['mécanique', 'carrosserie', 'peinture'],
      isActive: true,
    },
    {
      id: 'garage-4',
      uuid: 'garage-4',
      name: 'DABA PNEU AIN SEBAA',
      description: 'Spécialiste pneus et alignement roues',
      phone: '+212 5 22 45 67 89',
      address: '321 Route Ain Sebaa',
      city: 'Casablanca',
      basePriceMad: 120.00,
      formattedPrice: '120.00 MAD',
      rating: 4.6,
      formattedRating: '4.6/5',
      workingHoursStart: '08:00',
      workingHoursEnd: '18:30',
      servicesOffered: ['pneus', 'alignement', 'équilibrage'],
      isActive: true,
    },
    {
      id: 'garage-5',
      uuid: 'garage-5',
      name: 'AUTO TECH MAROC',
      description: 'Centre technique avec équipements modernes',
      phone: '+212 5 22 56 78 90',
      address: '654 Rue Sidi Belyout',
      city: 'Rabat',
      basePriceMad: 185.00,
      formattedPrice: '185.00 MAD',
      rating: 4.7,
      formattedRating: '4.7/5',
      workingHoursStart: '07:00',
      workingHoursEnd: '19:00',
      servicesOffered: ['diagnostic', 'réparation_moteur', 'climatisation'],
      isActive: true,
    },
    {
      id: 'garage-6',
      uuid: 'garage-6',
      name: 'MASTER GARAGE CASABLANCA',
      description: 'Grand garage service complet toutes marques',
      phone: '+212 5 22 89 01 23',
      address: '222 Rue Driss El Harti',
      city: 'Casablanca',
      basePriceMad: 200.00,
      formattedPrice: '200.00 MAD',
      rating: 4.9,
      formattedRating: '4.9/5',
      workingHoursStart: '07:00',
      workingHoursEnd: '20:00',
      servicesOffered: ['service_complet', 'électrique', 'clim', 'diagnostic'],
      isActive: true,
    },
  ];

  // Fake slots — 14 créneaux par jour
  fakeTimes = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'
  ];

  @action
  async loadGarages() {
    this.isLoading = true;
    // Simuler un délai réseau
    await new Promise(r => setTimeout(r, 300));
    this.garages = this.fakeGarages;
    this.citiesList = [...new Set(this.fakeGarages.map(g => g.city))].sort();
    this.isLoading = false;
  }

  @action
  async loadAvailableSlotsForDate(garageUuid, date) {
    // Simuler un délai réseau
    await new Promise(r => setTimeout(r, 200));

    // Générer fake slots pour cette date/garage
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

  // Méthodes de filtrage utilisées dans step3.js
  @action setCity(city) { this._city = city; }
  @action setSortBy(sort) { this._sort = sort; }
}
