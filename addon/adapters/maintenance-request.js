import FleetbaseAdapter from '@fleetbase/ember-core/adapters/application';

export default class MaintenanceRequestAdapter extends FleetbaseAdapter  {
  pathForType() {
    return 'maintenance-requests';
  }
}
