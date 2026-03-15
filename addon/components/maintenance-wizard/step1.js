import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MaintenanceWizardStep1Component extends Component {
  @service store;

  @tracked vehicles = [];
  @tracked drivers = [];
  @tracked selectedVehicle = null;
  @tracked selectedMaintenanceType = '';
  @tracked selectedCity = '';
  @tracked isLoading = true;

  @tracked selectedFleet = '';
  @tracked selectedDriver = '';
  @tracked searchVin = '';
  @tracked searchPlate = '';

  constructor() {
    super(...arguments);
    this.loadData();
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
    return this.selectedVehicle && this.selectedMaintenanceType && this.selectedCity;
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
    this.args.onUpdateData('vehicle', vehicle);
  }

  @action
  updateMaintenanceType(event) {
    this.selectedMaintenanceType = event.target.value; // ✅
    this.args.onUpdateData('maintenanceType', event.target.value);
  }

  @action
  updateCity(event) {
    this.selectedCity = event.target.value; // ✅
    this.args.onUpdateData('city', event.target.value);
  }
}
