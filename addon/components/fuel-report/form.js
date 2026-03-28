import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FuelReportFormComponent extends Component {
    @service fetch;
    @service notifications;
    
    @tracked receiptImageFile;
    @tracked receiptImagePreview;

    constructor() {
        super(...arguments);
        // S'enregistrer auprès du controller si disponible
        if (this.args.controller?.setFormComponent) {
            this.args.controller.setFormComponent(this);
        }
    }

    willDestroy() {
        super.willDestroy(...arguments);
        // Se désenregistrer lors de la destruction
        if (this.args.controller?.setFormComponent) {
            this.args.controller.setFormComponent(null);
        }
    }

    @action onAutocomplete({ location }) {
        if (!location) return;
        this.args.resource.setProperties({ location });
    }

    @action setReporter(user) {
        // ✅ NE PAS REMPLIR AUTOMATIQUEMENT
        if (!user) return;
        
        this.args.resource.set('reporter', user);
        this.args.resource.set('reported_by_uuid', user.uuid);  // ← UTILISER uuid, pas id
    }

    @action
    onReceiptImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.receiptImageFile = file;
            
            // Créer une prévisualisation
            const reader = new FileReader();
            reader.onload = (e) => {
                this.receiptImagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    @action
    removeReceiptImage() {
        this.receiptImageFile = null;
        this.receiptImagePreview = null;
        
        this.args.resource.set('receipt_image', null);
        this.args.resource.set('receipt_image_url', null);
        
        // Réinitialiser l'input file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    }
}