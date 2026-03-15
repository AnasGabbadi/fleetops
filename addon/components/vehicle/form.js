import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class VehicleFormComponent extends Component {
    @service store;
    @service fetch;
    @service currentUser;
    @service notifications;
    @service modalsManager;
    @tracked statusOptions = ['active', 'pending'];
    
    constructor() {
        super(...arguments);
        this.loadRelations.perform();
    }

    @task *loadRelations() {
        const vehicle = this.args.resource;
        try {
            // Charger la flotte
            if (vehicle && !vehicle.fleet) {
                yield vehicle.belongsTo('fleet').reload();
            }
            // Charger le conducteur
            if (vehicle && !vehicle.driver) {
                yield vehicle.belongsTo('driver').reload();
            }
        } catch (err) {
            console.warn('Error loading relations:', err);
        }
    }
    
    @action updateAvatarUrl(option) {
        this.args.resource.avatar_url = option.key === 'custom_avatar' ? option.value : [option.value];
    }

    @action updateSelectedImage(url) {
        this.args.resource.avatar_url = url;
    }

    @action assignDriver(driver) {
        this.args.resource.driver = driver;
        // trigger modified attributes via meta
        const meta = this.args.resource.meta ?? {};
        this.args.resource.meta = {
            ...meta,
        };
    }
    
    @action setMake(value) {
        this.args.resource.make = value;
    }

    @action setModel(value) {
        this.args.resource.model = value;
    }

    @action setYear(value) {
        this.args.resource.year = value;
    }

    @task *handlePhotoUpload(file) {
        try {
            yield this.fetch.uploadFile.perform(
                file,
                {
                    path: `uploads/${this.currentUser.companyId}/vehicles/${this.args.resource.id}`,
                    subject_uuid: this.args.resource.id,
                    subject_type: 'fleet-ops:vehicle',
                    type: 'vehicle_photo',
                },
                (uploadedFile) => {
                    this.args.resource.setProperties({
                        photo_uuid: uploadedFile.id,
                        photo_url: uploadedFile.url,
                        photo: uploadedFile,
                    });
                }
            );
        } catch (err) {
            this.notifications.error('Unable to upload photo: ' + err.message);
        }
    }
}