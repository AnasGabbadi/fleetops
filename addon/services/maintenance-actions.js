import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MaintenanceActionsService extends Service {
  @service store;
  @service notifications;
  @service hostRouter;

  @action
  createMaintenance() {
    this.hostRouter.transitionTo('console.fleet-ops.management.maintenances.new');
  }

  @action
  refresh() {
    window.location.reload();
  }

  @action
  export() {
    this.notifications.success('maintenance.actions.exported');
  }

  @action
  async viewMaintenance(maintenance) {
    this.hostRouter.transitionTo('console.fleet-ops.management.maintenances.view', maintenance.id);
  }

  @action
  async deleteMaintenance(maintenance) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande?')) {
      return;
    }

    try {
      await maintenance.destroyRecord();
      this.notifications.success('Demande supprimée avec succès');
      this.hostRouter.transitionTo('console.fleet-ops.management.maintenances');
    } catch (error) {
      this.notifications.error('Erreur lors de la suppression');
      console.error(error);
    }
  }
}