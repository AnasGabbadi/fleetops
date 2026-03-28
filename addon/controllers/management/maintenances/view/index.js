import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { alias } from '@ember/object/computed';

export default class ManagementMaintenancesViewIndexController extends Controller {
  @service store;
  @service notifications;
  @service('-routing') routing;  // ✅ Utiliser -routing
  @service session;

  @alias('model') maintenance;
  @tracked isUpdating = false;

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

  get canEdit() {
    return ['pending', 'confirmed'].includes(this.maintenance?.status);
  }

  get canConfirm() {
    return this.maintenance?.status === 'pending';
  }

  get canStart() {
    return this.maintenance?.status === 'confirmed';
  }

  get canComplete() {
    return this.maintenance?.status === 'in-progress';
  }

  get canPay() {
    return this.maintenance?.paymentStatus !== 'paid';
  }

  get canCancel() {
    return !['completed', 'cancelled'].includes(this.maintenance?.status);
  }

  @action
  back() {
    this.routing.transitionTo('console.fleet-ops.management.maintenances.index');
  }

  @action
  async confirmMaintenance() {
    if (!confirm('Confirmer cette demande de maintenance ?')) return;
    this.isUpdating = true;
    try {
      const token = this.session.data?.authenticated?.token;
      await fetch(`/int/v1/maintenance-requests/${this.maintenance.id}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await this.maintenance.reload();
      this.notifications.success('Demande confirmée');
    } catch (error) {
      this.notifications.error('Erreur');
    } finally {
      this.isUpdating = false;
    }
  }

  @action
  async startMaintenance() {
    if (!confirm('Démarrer cette maintenance ?')) return;
    this.isUpdating = true;
    try {
      const token = this.session.data?.authenticated?.token;
      await fetch(`/int/v1/maintenance-requests/${this.maintenance.id}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await this.maintenance.reload();
      this.notifications.success('Maintenance démarrée');
    } catch (error) {
      this.notifications.error('Erreur');
    } finally {
      this.isUpdating = false;
    }
  }

  @action
  async completeMaintenance() {
    if (!confirm('Terminer cette maintenance ?')) return;
    this.isUpdating = true;
    try {
      const token = this.session.data?.authenticated?.token;
      await fetch(`/int/v1/maintenance-requests/${this.maintenance.id}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await this.maintenance.reload();
      this.notifications.success('Maintenance terminée');
    } catch (error) {
      this.notifications.error('Erreur');
    } finally {
      this.isUpdating = false;
    }
  }

  @action
  async markAsPaid() {
    if (!confirm('Marquer comme payée ?')) return;
    this.isUpdating = true;
    try {
      const token = this.session.data?.authenticated?.token;
      await fetch(`/int/v1/maintenance-requests/${this.maintenance.id}/mark-paid`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await this.maintenance.reload();
      this.notifications.success('Paiement enregistré');
    } catch (error) {
      this.notifications.error('Erreur');
    } finally {
      this.isUpdating = false;
    }
  }

  @action
  async cancelMaintenance() {
    if (!confirm('Annuler cette maintenance ?')) return;
    this.isUpdating = true;
    try {
      const token = this.session.data?.authenticated?.token;
      await fetch(`/int/v1/maintenance-requests/${this.maintenance.id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await this.maintenance.reload();
      this.notifications.success('Maintenance annulée');
    } catch (error) {
      this.notifications.error('Erreur');
    } finally {
      this.isUpdating = false;
    }
  }
}