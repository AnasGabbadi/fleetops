import Route from '@ember/routing/route';
import { service } from '@ember/service';

/**
 * Route: Management > Maintenances > New
 * Point d'entrée du Wizard Maintenance
 */
export default class ManagementMaintenancesNewRoute extends Route {
  @service maintenanceWizard;

  beforeModel() {
    // Réinitialiser le wizard avant de charger la route
    this.maintenanceWizard.resetWizard();
  }

  setupController(controller) {
    super.setupController(controller);
    
    // Le wizard est géré par le service maintenanceWizard
    // Le composant maintenance-wizard l'utilisera directement
  }
}