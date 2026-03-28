import RESTSerializer from '@ember-data/serializer/rest';
import { underscore } from '@ember/string';

export default class MaintenanceRequestSerializer extends RESTSerializer {
  primaryKey = 'uuid';

  keyForAttribute(key) {
    return underscore(key);
  }

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    const items = payload.maintenanceRequests || payload.data || [];
    
    const normalized = {
      data: items.map((item) => {
        const recordId = item.uuid || item.id;
        if (!recordId) {
          console.error('❌ Pas d\'id/uuid pour:', item);
          return null;
        }
        return {
          id: recordId,
          type: primaryModelClass.modelName,
          attributes: this.normalizeItem(item),
        };
      }).filter(Boolean),
      meta: payload.meta || {},
    };
    
    return normalized;
  }

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    const item = payload.maintenanceRequest || payload.data || payload;
    if (!item) {
      console.error('❌ Pas de maintenance-request!');
      return { data: null };
    }
    const recordId = item.uuid || item.id;
    if (!recordId) {
      console.error('❌ Pas d\'id/uuid pour:', item);
      return { data: null };
    }
    return {
      data: {
        id: recordId,
        type: primaryModelClass.modelName,
        attributes: this.normalizeItem(item),
      },
      meta: payload.meta || {},
    };
  }

  normalizeItem(item) {
    const attributes = {};
    for (const key in item) {
      if (key === 'uuid' || key === 'id') continue;
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      attributes[camelKey] = item[key];
    }
    return attributes;
  }
}