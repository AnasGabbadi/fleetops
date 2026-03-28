import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

export default class VehicleFormComponent extends Component {
    @service store;
    @service fetch;
    @service currentUser;
    @service notifications;
    @service modalsManager;
    
    @tracked statusOptions = ['active', 'pending'];
    
    // Données Kounhany
    @tracked brands = [];
    @tracked models = [];
    @tracked versions = [];
    
    // Sélections actuelles
    @tracked selectedBrand = null;
    @tracked selectedModel = null;
    @tracked selectedVersion = null;
    
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
        this.loadRelations.perform();
        this.loadBrands();
    }

    @task *loadRelations() {
        const vehicle = this.args.resource;
        try {
            // Charger la flotte
            if (vehicle && !vehicle.fleet) {
                yield vehicle.belongsTo('fleet').reload();
            }
            // Charger le conducteur
            if (vehicle && !vehicle.driver) {
                yield vehicle.belongsTo('driver').reload();
            }
        } catch (err) {
            console.warn('Error loading relations:', err);
        }
    }
    
    // Charger les marques depuis Kounhany
    async loadBrands() {
        try {
            const response = await fetch(this.kounhanyBrandsApi);
            const data = await response.json();
            this.brands = data.brands || [];
            
            // Si le véhicule a déjà une marque (édition), essayer de la pré-sélectionner
            if (this.args.resource.make) {
                this.preselectBrand();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des marques:', error);
            this.notifications.error('Impossible de charger les marques de véhicules');
        }
    }
    
    // Pré-sélectionner la marque si véhicule existant
    preselectBrand() {
        const makeName = this.args.resource.make;
        if (makeName && this.brands.length > 0) {
            const brand = this.brands.find(b => b.manuName === makeName);
            if (brand) {
                this.selectedBrand = brand;
                // Charger aussi les modèles si nécessaire
                if (this.args.resource.model) {
                    this.loadModelsForPreselect(brand.manuId);
                }
            }
        }
    }
    
    // Charger les modèles pour pré-sélection
    async loadModelsForPreselect(brandId) {
        try {
            const response = await fetch(`${this.kounhanyModelsApi}?brand=${brandId}`);
            const data = await response.json();
            this.models = data.models || [];
            
            // Pré-sélectionner le modèle si existant
            const modelName = this.args.resource.model;
            if (modelName && this.models.length > 0) {
                const model = this.models.find(m => m.modelname === modelName);
                if (model) {
                    this.selectedModel = model;
                    // Charger aussi les versions si nécessaire
                    if (this.args.resource.version) {
                        this.loadVersionsForPreselect(brandId, model.modelId);
                    }
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des modèles:', error);
        }
    }
    
    // Charger les versions pour pré-sélection
    async loadVersionsForPreselect(brandId, modelId) {
        try {
            const response = await fetch(`${this.kounhanyVersionsApi}?brand=${brandId}&model=${modelId}`);
            const data = await response.json();
            this.versions = data.vins || [];
            
            // Pré-sélectionner la version si existante
            const versionName = this.args.resource.version;
            if (versionName && this.versions.length > 0) {
                const version = this.versions.find(v => v.carName === versionName);
                if (version) {
                    this.selectedVersion = version;
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des versions:', error);
        }
    }
    
    // Action quand l'utilisateur sélectionne une marque
    @action
    async onBrandChange(brand) {
        this.selectedBrand = brand;
        this.selectedModel = null;
        this.selectedVersion = null;
        this.models = [];
        this.versions = [];
        
        // Mettre à jour le véhicule
        this.args.resource.make = brand ? brand.manuName : null;
        this.args.resource.model = null;
        this.args.resource.version = null;
        
        // Charger les modèles pour cette marque
        if (brand) {
            try {
                const response = await fetch(`${this.kounhanyModelsApi}?brand=${brand.manuId}`);
                const data = await response.json();
                this.models = data.models || [];
            } catch (error) {
                console.error('Erreur lors du chargement des modèles:', error);
                this.notifications.error('Impossible de charger les modèles');
            }
        }
    }
    
    // Action quand l'utilisateur sélectionne un modèle
    @action
    async onModelChange(model) {
        this.selectedModel = model;
        this.selectedVersion = null;
        this.versions = [];
        
        // Mettre à jour le véhicule
        this.args.resource.model = model ? model.modelname : null;
        this.args.resource.version = null;
        
        // Charger les versions pour ce modèle
        if (model && this.selectedBrand) {
            try {
                const response = await fetch(`${this.kounhanyVersionsApi}?brand=${this.selectedBrand.manuId}&model=${model.modelId}`);
                const data = await response.json();
                this.versions = data.vins || [];
            } catch (error) {
                console.error('Erreur lors du chargement des versions:', error);
                this.notifications.error('Impossible de charger les versions');
            }
        }
    }
    
    // Action quand l'utilisateur sélectionne une version
    @action
    onVersionChange(version) {
        this.selectedVersion = version;
        
        // Mettre à jour le véhicule
        this.args.resource.version = version ? version.carName : null;
    }
    
    @action updateAvatarUrl(option) {
        this.args.resource.avatar_url = option.key === 'custom_avatar' ? option.value : [option.value];
    }

    @action updateSelectedImage(url) {
        this.args.resource.avatar_url = url;
    }

    @action assignDriver(driver) {
        this.args.resource.driver = driver;
        // trigger modified attributes via meta
        const meta = this.args.resource.meta ?? {};
        this.args.resource.meta = {
            ...meta,
        };
    }

    @action setYear(value) {
        this.args.resource.year = value;
    }

    @task *handlePhotoUpload(file) {
        try {
            yield this.fetch.uploadFile.perform(
                file,
                {
                    path: `uploads/${this.currentUser.companyId}/vehicles/${this.args.resource.id}`,
                    subject_uuid: this.args.resource.id,
                    subject_type: 'fleet-ops:vehicle',
                    type: 'vehicle_photo',
                },
                (uploadedFile) => {
                    this.args.resource.setProperties({
                        photo_uuid: uploadedFile.id,
                        photo_url: uploadedFile.url,
                        photo: uploadedFile,
                    });
                }
            );
        } catch (err) {
            this.notifications.error('Unable to upload photo: ' + err.message);
        }
    }
}