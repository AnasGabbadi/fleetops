import RESTAdapter from '@ember-data/adapter/rest';

export default class AppointmentSlotAdapter extends RESTAdapter {
  namespace = 'int/v1';
  pathForType() {
    return 'appointment-slots';
  }
}