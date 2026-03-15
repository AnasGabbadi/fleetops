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
}
