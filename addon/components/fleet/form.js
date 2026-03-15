import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class FleetFormComponent extends Component {
    @service store;
    @service notifications;

    @tracked isCreating = false;

    get writePermission() {
        return 'fleet-ops create fleet';
    }

    @task *createFleet() {
        try {
            this.isCreating = true;
            const fleet = this.args.resource;

            // ✅ Sauvegarder JUSTE les 4 champs
            yield fleet.save();

            this.notifications.success('Flotte créée avec succès!');
            this.isCreating = false;

            if (this.args.onSuccess) {
                this.args.onSuccess(fleet);
            }
        } catch (error) {
            this.notifications.error('Erreur: ' + error.message);
            this.isCreating = false;
        }
}

    @action
    cancel() {
        if (this.args.onCancel) {
            this.args.onCancel();
        }
    }
}