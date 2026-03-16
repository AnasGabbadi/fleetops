import ApplicationAdapter from './application';

export default class MaintenanceAdapter extends ApplicationAdapter {
  pathForType(modelName) {
    return 'maintenance'; // Force singulier
  }
}
