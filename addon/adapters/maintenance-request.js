import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class MaintenanceRequestAdapter extends RESTAdapter {
  @service session;
  
  namespace = 'int/v1';
  
  get headers() {
    const headers = {};
    
    // ✅ AJOUTER LE TOKEN D'AUTHENTIFICATION
    if (this.session?.isAuthenticated) {
      const token = this.session?.data?.authenticated?.token;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }
  
  pathForType(modelName) {
    return 'maintenance-requests';
  }
}