import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MaintenanceModel extends Model {
  @attr publicId;
  @attr status;
  @attr maintenanceType;
  @attr city;
  @attr notes;
  @attr totalCostMad;
  @attr paymentStatus;
  @attr appointmentDate;
  @attr createdAt;
  @attr updatedAt;

  @belongsTo('vehicle') vehicle;
  @belongsTo('garage') garage;
  @hasMany('maintenance-item') items;
}
