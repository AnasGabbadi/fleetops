import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MaintenanceWizardComponent extends Component {
  @service router;  // ✅ injecté

  @tracked currentStep = 1;
  @tracked isSubmitting = false;
  @tracked wizardData = {
    vehicle: null,
    maintenanceType: '',
    city: '',
    cartItems: [],
    garage: null,
    appointmentSlot: null,
    notes: ''
  };

  @action
  goToStep(step) {
    this.currentStep = step;
  }

  @action
  handleNextStep() {
    if (this.currentStep < 4) {
      this.currentStep += 1;
    }
  }

  @action
  handlePreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  @action
  handleCancel() {
    if (confirm('Annuler et perdre les données?')) {
      this.currentStep = 1;
      this.wizardData = {};
    }
  }

  @action
  handleConfirm() {
    this.isSubmitting = false;
      setTimeout(() => {
      window.location.href = '/fleet-ops/maintenances';
    }, 3000);
  }

  @action
  updateWizardData(key, value) {
    this.wizardData = { ...this.wizardData, [key]: value };
  }
}
