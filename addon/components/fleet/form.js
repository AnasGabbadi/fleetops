import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

export default class FleetFormComponent extends Component {
    @service store;
    @service notifications;

    @tracked isCreating = false;
    @tracked cities = [];
    @tracked selectedCity = null;

    // URL de l'API des villes depuis .env
    get kounhanyCitiesApi() {
        return config.KOUNHANY_CITIES_API || 'https://kounhany.com/api/cities/lite';
    }

    constructor() {
        super(...arguments);
        
        // Charger les villes
        this.loadCities();
    }

    // Charger les villes du Maroc depuis Kounhany
    async loadCities() {
        try {
            const response = await fetch(`${this.kounhanyCitiesApi}?country=1`);
            const data = await response.json();
            this.cities = data.cities || [];
            
            // Pré-sélectionner la ville après chargement si nécessaire
            if (this.args.resource.city && this.cities.length > 0) {
                this.preselectCity();
            }
            
            // Initialiser le pays APRÈS le chargement des villes (hors du cycle de rendu)
            this.initializeCountry();
        } catch (error) {
            console.error('Erreur chargement villes:', error);
            this.notifications.error('Impossible de charger les villes');
        }
    }

    // Initialiser le pays à Morocco si vide
    initializeCountry() {
        if (!this.args.resource.country) {
            // Utiliser requestAnimationFrame pour sortir du cycle de rendu
            requestAnimationFrame(() => {
                this.args.resource.country = 'Morocco';
            });
        }
    }

    // Pré-sélectionner la ville si la flotte existe déjà (édition)
    preselectCity() {
        const cityName = this.args.resource.city;
        if (cityName && this.cities.length > 0) {
            const city = this.cities.find(c => c.city === cityName);
            if (city) {
                this.selectedCity = city;
            }
        }
    }

    get writePermission() {
        return 'fleet-ops create fleet';
    }

    @action
    onCityChange(city) {
        this.selectedCity = city;
        this.args.resource.city = city ? city.city : null;
    }

    @task *createFleet() {
        try {
            this.isCreating = true;
            const fleet = this.args.resource;

            // S'assurer que le pays est bien défini avant de sauvegarder
            if (!fleet.country) {
                fleet.country = 'Morocco';
            }

            // Sauvegarder la flotte
            yield fleet.save();

            this.notifications.success('Flotte créée avec succès!');
            this.isCreating = false;

            if (this.args.onSuccess) {
                this.args.onSuccess(fleet);
            }
        } catch (error) {
            this.notifications.error('Erreur: ' + error.message);
            this.isCreating = false;
        }
    }

    @action
    cancel() {
        if (this.args.onCancel) {
            this.args.onCancel();
        }
    }
}