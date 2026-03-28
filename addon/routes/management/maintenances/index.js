import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ManagementMaintenancesIndexRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    limit: { refreshModel: true },
    sort: { refreshModel: true }
  };

  model(params) {
    return this.store.query('maintenance-request', {
      page: params.page || 1,
      limit: params.limit || 10,
      sort: params.sort || '-createdAt'
    });
  }
}
