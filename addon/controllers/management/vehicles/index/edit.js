import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class ManagementVehiclesIndexEditController extends Controller {
    @service hostRouter;
    @service intl;
    @service notifications;
    @service modalsManager;
    @service events;
    @tracked overlay;
    @tracked actionButtons = [
        {
            icon: 'eye',
            fn: this.view,
        },
    ];

    @action setupComponent() {
        // Charger les relations manquantes
        this.loadRelations.perform(this.model);
    }

    @task *loadRelations(vehicle) {
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
            // Silencieusement échouer si les relations n'existent pas
            console.warn('Error loading relations:', err);
        }
    }

    @task *save(vehicle) {
        try {
            yield vehicle.save();
            this.events.trackResourceUpdated(vehicle);
            this.overlay?.close();

            yield this.hostRouter.transitionTo('console.fleet-ops.management.vehicles.index.details', vehicle);
            this.notifications.success(
                this.intl.t('common.resource-updated-success', {
                    resource: this.intl.t('resource.vehicle'),
                    resourceName: vehicle.display_name,
                })
            );
        } catch (err) {
            this.notifications.serverError(err);
        }
    }

    @action cancel() {
        if (this.model.hasDirtyAttributes) {
            return this.#confirmContinueWithUnsavedChanges(this.model);
        }

        return this.hostRouter.transitionTo('console.fleet-ops.management.vehicles.index');
    }

    @action view() {
        if (this.model.hasDirtyAttributes) {
            return this.#confirmContinueWithUnsavedChanges(this.model);
        }

        return this.hostRouter.transitionTo('console.fleet-ops.management.vehicles.index.details', this.model);
    }

    #confirmContinueWithUnsavedChanges(vehicle, options = {}) {
        return this.modalsManager.confirm({
            title: this.intl.t('common.continue-without-saving'),
            body: this.intl.t('common.continue-without-saving-prompt', { resource: this.intl.t('resource.vehicle') }),
            acceptButtonText: this.intl.t('common.continue'),
            confirm: async () => {
                vehicle.rollbackAttributes();
                await this.hostRouter.transitionTo('console.fleet-ops.management.vehicles.index.details', vehicle);
            },
            ...options,
        });
    }
}