import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ManagementMaintenancesDetailsController extends Controller {
    @service hostRouter;
    @service modalsManager;
    @service notifications;
    @service intl;
    @service store;

    get actionButtons() {
        return [
            {
                icon: 'pencil',
                helpText: 'Modifier',
                fn: this.edit,
            },
        ];
    }

    @action edit() {
        return this.hostRouter.transitionTo(
            'console.fleet-ops.management.maintenances.edit',
            this.model
        );
    }
}
