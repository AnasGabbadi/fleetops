import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class FleetAssignVehiclesComponent extends Component {
    @service store;
    @service notifications;

    @tracked filterVin = '';
    @tracked filterPlate = '';
    @tracked filterMake = '';
    @tracked filterModel = '';
    @tracked filterVersion = '';
    @tracked availablePage = 1;  // ← PAGINATION DISPONIBLES
    @tracked selectedPage = 1;   // ← PAGINATION SÉLECTIONNÉS
    @tracked allVehicles = [];
    @tracked selectedVehicles = [];
    @tracked isLoaded = false;
    
    vehiclesPerPage = 3;  // ← AFFICHER 4 VÉHICULES PAR PAGE

    constructor() {
        super(...arguments);
        this.loadData.perform();
    }

    get fleet() {
        return this.args.options?.fleet;
    }

    @task *loadData() {
        try {
            const vehicles = yield this.store.query('vehicle', {
                limit: -1,
                status: 'active'
            });
            this.allVehicles = vehicles.toArray();

            if (this.fleet && this.fleet.vehicles) {
                yield this.fleet.hasMany('vehicles').reload();
                this.selectedVehicles = this.fleet.vehicles.toArray();
            }

            this.isLoaded = true;
        } catch (err) {
            console.error('❌ ERREUR CHARGEMENT:', err);
            this.isLoaded = true;
        }
    }

    get filteredAvailableVehicles() {
        const selectedUuids = this.selectedVehicles.map(v => v.uuid);

        let vehicles = this.allVehicles.filter(v =>
            !selectedUuids.includes(v.uuid) &&
            (!v.fleet_uuid || v.fleet_uuid === this.fleet.uuid)
        );

        if (this.filterVin?.trim()) {
            const q = this.filterVin.toLowerCase();
            vehicles = vehicles.filter(v => v.vin?.toLowerCase().includes(q));
        }

        if (this.filterPlate?.trim()) {
            const q = this.filterPlate.toLowerCase();
            vehicles = vehicles.filter(v => v.plate_number?.toLowerCase().includes(q));
        }

        if (this.filterMake?.trim()) {
            const q = this.filterMake.toLowerCase();
            vehicles = vehicles.filter(v => v.make?.toLowerCase().includes(q));
        }

        if (this.filterModel?.trim()) {
            const q = this.filterModel.toLowerCase();
            vehicles = vehicles.filter(v => v.model?.toLowerCase().includes(q));
        }

        if (this.filterVersion?.trim()) {
            const q = this.filterVersion.toLowerCase();
            vehicles = vehicles.filter(v => v.version?.toLowerCase().includes(q));
        }

        return vehicles;
    }

    // ✅ PAGINER LES VÉHICULES DISPONIBLES
    get paginatedAvailableVehicles() {
        const start = (this.availablePage - 1) * this.vehiclesPerPage;
        const end = start + this.vehiclesPerPage;
        return this.filteredAvailableVehicles.slice(start, end);
    }

    get availableTotalPages() {
        return Math.ceil(this.filteredAvailableVehicles.length / this.vehiclesPerPage);
    }

    // ✅ PAGINER LES VÉHICULES SÉLECTIONNÉS
    get paginatedSelectedVehicles() {
        const start = (this.selectedPage - 1) * this.vehiclesPerPage;
        const end = start + this.vehiclesPerPage;
        return this.selectedVehicles.slice(start, end);
    }

    get selectedTotalPages() {
        return Math.ceil(this.selectedVehicles.length / this.vehiclesPerPage);
    }

    @action
    addVehicleToSelection(vehicle) {
        if (!this.selectedVehicles.some(v => v.uuid === vehicle.uuid)) {
            this.selectedVehicles = [...this.selectedVehicles, vehicle];
        }
    }

    @action
    removeVehicleFromSelection(vehicle) {
        this.selectedVehicles = this.selectedVehicles.filter(v => v.uuid !== vehicle.uuid);
    }

    @action
    goToAvailablePage(page) {
        this.availablePage = page;
    }

    @action
    goToSelectedPage(page) {
        this.selectedPage = page;
    }

    @task *saveAllVehicles() {
        try {
            const currentVehicles = yield this.fleet.hasMany('vehicles').reload();
            const currentVehiclesArray = currentVehicles.toArray();
            const currentVehicleUuids = currentVehiclesArray.map(v => v.uuid);
            const selectedVehicleUuids = this.selectedVehicles.map(v => v.uuid);

            let removedCount = 0;
            let addedCount = 0;

            for (const vehicle of currentVehiclesArray) {
                if (!selectedVehicleUuids.includes(vehicle.uuid)) {
                    vehicle.fleet_uuid = null;
                    vehicle.fleet = null;
                    yield vehicle.save();
                    removedCount++;
                }
            }

            for (const vehicle of this.selectedVehicles) {
                if (!currentVehicleUuids.includes(vehicle.uuid)) {
                    addedCount++;
                }
                vehicle.fleet_uuid = this.fleet.uuid;
                vehicle.fleet = this.fleet;
                yield vehicle.save();
            }

            let message = '';
            if (addedCount > 0 && removedCount > 0) {
                message = `${addedCount} ajouté(s), ${removedCount} retiré(s)`;
            } else if (addedCount > 0) {
                message = `${addedCount} véhicule(s) ajouté(s)`;
            } else if (removedCount > 0) {
                message = `${removedCount} véhicule(s) retiré(s)`;
            } else {
                message = 'Aucun changement';
            }

            this.notifications.success(message);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            this.notifications.error('Erreur: ' + err.message);
        }
    }
}