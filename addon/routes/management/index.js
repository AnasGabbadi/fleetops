import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ManagementIndexRoute extends Route {
    @service hostRouter;

    redirect() {
        this.hostRouter.transitionTo('console.fleet-ops.management.vehicles');
    }
}
