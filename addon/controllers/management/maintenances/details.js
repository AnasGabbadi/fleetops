import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ManagementMaintenancesDetailsController extends Controller {
  @service hostRouter;

  get actionButtons() {
    return [
      {
        icon: 'pencil',
        fn: () => this.hostRouter.transitionTo('console.fleet-ops.management.maintenances.edit', this.model),
      },
    ];
  }
}
