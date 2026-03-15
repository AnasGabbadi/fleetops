import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ManagementMaintenancesViewController extends Controller {
  @service store;
  @service notifications;

  @tracked maintenance = null;
  @tracked garage = null;
  @tracked appointmentSlot = null;
  @tracked items = [];
  @tracked isUpdating = false;

  @action
  back() {
    this.transitionToRoute('management.maintenances.index');
  }

  @action
  edit() {
    this.transitionToRoute('management.maintenances.edit', this.maintenance.id);
  }

  @action
  async confirmMaintenance() {
    if (!confirm('Confirmer cette demande de maintenance ?')) {
      return;
    }

    this.isUpdating = true;

    try {
      await this.store.ajax(`/internal/v1/maintenance-requests/${this.maintenance.id}/confirm`, 'POST');
      await this.maintenance.reload();
      this.notifications.success('Demande confirmée');
    } catch (error) {
      console.error('Erreur:', error);
      this.notifications.error('Erreur lors de la confirmation');
    } finally {
      this.isUpdating = false;
    }
  }

  get costBreakdown() {
    if (!this.maintenance) return null;

    return {
      productsCost: this.maintenance.totalProductsCostMad || 0,
      serviceCost: this.maintenance.garageServiceCostMad || 0,
      subtotal: this.maintenance.subtotalMad || 0,
      tax: this.maintenance.taxMad || 0,
      discount: this.maintenance.discountMad || 0,
      total: this.maintenance.totalCostMad || 0
    };
  }
}
