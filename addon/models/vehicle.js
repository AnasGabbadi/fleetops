import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VehicleModel extends Model {
  @attr('string') displayName;
  @attr('string') plateNumber;
  @attr('string') vin;
  @attr('number') year;
  @attr('string') make;
  @attr('string') model;
  @attr('string') driverName;
  @attr('string') fleetName;
  @attr('string') photoUrl;
  @attr('boolean') online;

  @belongsTo('fleet') fleet;
  @belongsTo('driver') driver;
}
