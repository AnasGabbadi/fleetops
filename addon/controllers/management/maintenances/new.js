import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

const DEFAULT_PROPERTIES = { status: 'pending' };

export default class ManagementMaintenancesNewController extends Controller {
  @service store;
  @service hostRouter;
  @service intl;
  @service notifications;
  @service events;
  
  @tracked overlay;
  @tracked maintenance = this.store.createRecord('maintenance', DEFAULT_PROPERTIES);

  @task *save(maintenance) {
    const requiredFields = [
      { field: 'vehicle_uuid', label: 'Véhicule' },
      { field: 'garage_uuid', label: 'Garage' },
      { field: 'appointmentDate', label: 'Date du rendez-vous' },
    ];

    for (const { field, label } of requiredFields) {
      if (!maintenance[field]) {
        this.notifications.warning(`Le champ "${label}" est obligatoire.`);
        return;
      }
    }

    try {
      yield maintenance.save();
      this.events.trackResourceCreated(maintenance);
      this.overlay?.close();

      yield this.hostRouter.refresh();
      yield this.hostRouter.transitionTo('console.fleet-ops.management.maintenances.details', maintenance);
      this.notifications.success('Maintenance créée avec succès');
      this.resetForm();
    } catch (err) {
      this.notifications.serverError(err);
    }
  }

  @action
  resetForm() {
    this.maintenance = this.store.createRecord('maintenance', DEFAULT_PROPERTIES);
  }
}
