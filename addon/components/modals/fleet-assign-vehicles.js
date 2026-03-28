import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

export default class FleetAssignVehiclesComponent extends Component {
    @service store;
    @service notifications;

    @tracked filterVin = '';
    @tracked filterPlate = '';
    @tracked filterMake = '';
    @tracked filterModel = '';
    @tracked filterVersion = '';
    @tracked availablePage = 1;
    @tracked selectedPage = 1;
    @tracked allVehicles = [];
    @tracked selectedVehicles = [];
    @tracked isLoaded = false;
    
    // Données Kounhany pour les filtres
    @tracked brands = [];
    @tracked models = [];
    @tracked versions = [];
    @tracked selectedFilterBrand = null;
    @tracked selectedFilterModel = null;
    @tracked selectedFilterVersion = null;
    
    vehiclesPerPage = 3;

    // URLs des APIs depuis .env
    get kounhanyBrandsApi() {
        return config.KOUNHANY_BRANDS_API || 'https://kounhany.com/api/mock/garage/lite-car-brands';
    }
    
    get kounhanyModelsApi() {
        return config.KOUNHANY_MODELS_API || 'https://kounhany.com/api/mock/garage/lite-car-models';
    }
    
    get kounhanyVersionsApi() {
        return config.KOUNHANY_VERSIONS_API || 'https://kounhany.com/api/mock/garage/lite-car-vins';
    }

    constructor() {
        super(...arguments);
        this.loadData.perform();
        this.loadBrands(); // Charger les marques pour les filtres
    }

    get fleet() {
        return this.args.options?.fleet;
    }

    // Charger les marques depuis Kounhany
    async loadBrands() {
        try {
            const response = await fetch(this.kounhanyBrandsApi);
            const data = await response.json();
            this.brands = data.brands || [];
        } catch (error) {
            console.error('Erreur chargement marques:', error);
        }
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

    // Action quand une marque est sélectionnée dans les filtres
    @action
    async onFilterBrandChange(brand) {
        this.selectedFilterBrand = brand;
        this.selectedFilterModel = null;
        this.selectedFilterVersion = null;
        this.models = [];
        this.versions = [];
        
        // Mettre à jour le filtre texte
        this.filterMake = brand ? brand.manuName : '';
        this.filterModel = '';
        this.filterVersion = '';
        
        // Charger les modèles pour cette marque
        if (brand) {
            try {
                const response = await fetch(`${this.kounhanyModelsApi}?brand=${brand.manuId}`);
                const data = await response.json();
                this.models = data.models || [];
            } catch (error) {
                console.error('Erreur chargement modèles:', error);
            }
        }
    }
    
    // Action quand un modèle est sélectionné dans les filtres
    @action
    async onFilterModelChange(model) {
        this.selectedFilterModel = model;
        this.selectedFilterVersion = null;
        this.versions = [];
        
        // Mettre à jour le filtre texte
        this.filterModel = model ? model.modelname : '';
        this.filterVersion = '';
        
        // Charger les versions pour ce modèle
        if (model && this.selectedFilterBrand) {
            try {
                const response = await fetch(`${this.kounhanyVersionsApi}?brand=${this.selectedFilterBrand.manuId}&model=${model.modelId}`);
                const data = await response.json();
                this.versions = data.vins || [];
            } catch (error) {
                console.error('Erreur chargement versions:', error);
            }
        }
    }
    
    // Action quand une version est sélectionnée dans les filtres
    @action
    onFilterVersionChange(version) {
        this.selectedFilterVersion = version;
        
        // Mettre à jour le filtre texte
        this.filterVersion = version ? version.carName : '';
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

    get paginatedAvailableVehicles() {
        const start = (this.availablePage - 1) * this.vehiclesPerPage;
        const end = start + this.vehiclesPerPage;
        return this.filteredAvailableVehicles.slice(start, end);
    }

    get availableTotalPages() {
        return Math.ceil(this.filteredAvailableVehicles.length / this.vehiclesPerPage);
    }

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