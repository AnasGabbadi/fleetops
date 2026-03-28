import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ManagementMaintenancesViewIndexRoute extends Route {
  @service store;
  @service notifications;

  async model() {
    const id = this.paramsFor('management.maintenances.view').id;
    
    try {
      // Utiliser query qui retourne un tableau, puis prendre le premier élément
      const results = await this.store.query('maintenance-request', { 
        id: id,
        limit: 1
      });

      const maintenance = results.firstObject;
      
      if (!maintenance) {
        throw new Error('Maintenance non trouvée');
      }

      return maintenance;
    } catch (error) {
      console.error('Erreur:', error);
      this.notifications.error('Impossible de charger la maintenance');
      this.transitionTo('management.maintenances.index');
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    console.log('🔍 Model chargé:', model);
    console.log('🔍 Attributs:', model?.toJSON?.());
    
    if (model) {
      controller.maintenance = model;
      controller.garage = model.garage;
      controller.appointmentSlot = model.appointmentSlot;
      controller.items = model.items || [];
    }
  }
}
