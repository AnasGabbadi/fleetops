import RESTAdapter from '@ember-data/adapter/rest';

export default class GarageAdapter extends RESTAdapter {
  namespace = 'int/v1';
  pathForType() {
    return 'garages';
  }
}