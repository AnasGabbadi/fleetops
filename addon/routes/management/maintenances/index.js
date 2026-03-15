import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ManagementMaintenancesIndexRoute extends Route {
  @service store;

  model() {
    return this.store.query('maintenance-request', {
      page: 1,
      limit: 10,
      sort: '-createdAt',
    });
  }
}