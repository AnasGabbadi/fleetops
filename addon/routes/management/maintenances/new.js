import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ManagementMaintenancesNewRoute extends Route {
  @service store;
  @service notifications;
  @service hostRouter;
  @service abilities;
  @service intl;

  beforeModel() {
    if (this.abilities.cannot('fleet-ops create maintenance-request')) {
      this.notifications.warning(this.intl.t('common.unauthorized-access'));
      return this.hostRouter.transitionTo('console.fleet-ops.management.maintenances.index');
    }
  }

  model() {
    return this.store.createRecord('maintenance-request', {});
  }
}