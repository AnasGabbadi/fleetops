import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';

export default class MaintenanceWizardStep1Component extends Component {
  @service store;

  @tracked vehicles = [];
  @tracked drivers = [];
  @tracked selectedVehicle = null;
  @tracked selectedCity = '';
  @tracked isLoading = true;

  @tracked selectedFleet = '';
  @tracked selectedDriver = '';
  @tracked searchVin = '';
  @tracked searchPlate = '';
  
  // Données des APIs Kounhany
  @tracked prestations = [];
  @tracked cities = [];
  @tracked selectedPrestation = null;
  @tracked selectedCityObj = null;

  // URLs des APIs depuis .env
  get kounhanyPrestationsApi() {
    return config.KOUNHANY_PRESTATIONS_API || 'https://kounhany.com/api/BMGWD/BMGSRCHFRM';
  }
  
  get kounhanyCitiesApi() {
    return config.KOUNHANY_CITIES_API || 'https://kounhany.com/api/cities/lite';
  }

  constructor() {
    super(...arguments);
    this.loadData();
    this.loadPrestations();
    this.loadCities();
  }

  async loadData() {
    try {
      this.isLoading = true;
      this.vehicles = await this.store.findAll('vehicle');
      this.drivers = await this.store.findAll('driver');
      console.log('Données chargées:', { vehicles: this.vehicles.length, drivers: this.drivers.length });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Charger les prestations depuis Kounhany
  async loadPrestations() {
    try {
      const response = await fetch(this.kounhanyPrestationsApi);
      const data = await response.json();
      this.prestations = data.prestations || [];
      console.log('Prestations chargées:', this.prestations.length);
    } catch (error) {
      console.error('Erreur chargement prestations:', error);
    }
  }

  // Charger les villes depuis Kounhany (Maroc = country 1)
  async loadCities() {
    try {
      const response = await fetch(`${this.kounhanyCitiesApi}?country=1`);
      const data = await response.json();
      this.cities = data.cities || [];
      console.log('Villes chargées:', this.cities.length);
    } catch (error) {
      console.error('Erreur chargement villes:', error);
    }
  }

  get fleetsList() {
    const fleets = new Map();
    this.vehicles.forEach(vehicle => {
      try {
        const fleet = vehicle.get('fleet');
        if (fleet) {
          const fleetId = fleet.id;
          const fleetName = fleet.get('name') || 'Sans nom';
          if (!fleets.has(fleetId)) {
            fleets.set(fleetId, { id: fleetId, name: fleetName });
          }
        }
      } catch (e) {
        //
      }
    });
    return Array.from(fleets.values());
  }

  get driversList() {
    return this.drivers.map(driver => {
      const name = driver.name || 'Sans nom';
      const vehicleInfo = driver.vehicle_name ? ` (${driver.vehicle_name})` : '';
      return { 
        id: driver.id,
        vehicleUuid: driver.vehicle_uuid,
        name: `${name}${vehicleInfo}`
      };
    });
  }

  get selectedDriverVehicleUuid() {
    if (!this.selectedDriver) return null;
    const driver = this.drivers.find(d => d.id === this.selectedDriver);
    return driver?.vehicle_uuid;
  }

  get filteredVehicles() {
    const fleetFilter = this.selectedFleet;
    const driverVehicleUuid = this.selectedDriverVehicleUuid;
    const vinSearch = this.searchVin.toLowerCase();
    const plateSearch = this.searchPlate.toLowerCase();
    
    const filtered = this.vehicles.filter(vehicle => {
      try {
        if (fleetFilter) {
          const fleet = vehicle.get('fleet');
          if (fleet?.id !== fleetFilter) return false;
        }
        
        if (driverVehicleUuid) {
          if (vehicle.id !== driverVehicleUuid) return false;
        }
        
        if (vinSearch && !vehicle.vin?.toLowerCase().includes(vinSearch)) {
          return false;
        }
        
        if (plateSearch && !vehicle.plate_number?.toLowerCase().includes(plateSearch)) {
          return false;
        }
        
        return true;
      } catch (e) {
        return false;
      }
    });
    
    return filtered;
  }

  get isStep1Valid() {
    return this.selectedVehicle && this.selectedPrestation && this.selectedCity;
  }

  @action
  onSelectFleet(event) {
    this.selectedFleet = event.target.value;
  }

  @action
  onSelectDriver(event) {
    this.selectedDriver = event.target.value;
  }

  @action
  onSearchVin(event) {
    this.searchVin = event.target.value;
  }

  @action
  onSearchPlate(event) {
    this.searchPlate = event.target.value;
  }

  @action
  selectVehicle(vehicle) {
    this.selectedVehicle = vehicle;
    
    // Récupérer la ville de la flotte pour pré-remplir
    try {
      const fleet = vehicle.get('fleet');
      if (fleet) {
        const fleetCity = fleet.get('city') || fleet.city;
        
        // Essayer de trouver la ville correspondante dans la liste
        if (fleetCity && this.cities.length > 0) {
          const cityObj = this.cities.find(c => c.city === fleetCity);
          if (cityObj) {
            this.selectedCityObj = cityObj;
            this.selectedCity = cityObj.city;
            this.args.onUpdateData('city', cityObj.city);
            console.log('🏙️ VILLE PRÉ-REMPLIE:', cityObj.city);
          }
        }
      }
    } catch (e) {
      console.warn('⚠️ Impossible de récupérer la ville de la flotte:', e);
    }
    
    this.args.onUpdateData('vehicle', vehicle);
  }

  @action
  onPrestationChange(prestation) {
    this.selectedPrestation = prestation;
    // Stocker l'objet complet pour afficher le titre dans les étapes suivantes
    this.args.onUpdateData('maintenanceType', prestation ? prestation.title : '');
    this.args.onUpdateData('maintenanceTypeUuid', prestation ? prestation.uuid : '');
  }

  @action
  onCityChange(city) {
    this.selectedCityObj = city;
    this.selectedCity = city ? city.city : '';
    this.args.onUpdateData('city', city ? city.city : '');
  }
}