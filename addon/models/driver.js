import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DriverModel extends Model {
  @attr('string') publicId;
  @attr('string') internalId;
  @attr('string') companyUuid;
  @attr('string') fleetUuid;
  @attr('string') vehicleUuid;
  @attr('string') vendorUuid;
  @attr('string') userUuid;
  @attr('string') name;
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') email;
  @attr('string') phone;
  @attr('string') avatarUrl;
  @attr('string') country;
  @attr('string') city;
  @attr('string') currency;
  @attr('string') status;
  @attr('string') currentStatus;
  @attr('string') slug;
  @attr('boolean') online;
  @attr('string') driversLicenseNumber;
  @attr('date') driversLicenseExpiry;

  get driversLicenseExpiryFormatted() {
    if (!this.driversLicenseExpiry) return null;
    return this.driversLicenseExpiry;
  }

  get name() {
    return this.firstName && this.lastName ? `${this.firstName} ${this.lastName}` : this.firstName || this.lastName || null;
  }

  @attr() meta;
  @attr('date') createdAt;
  @attr('date') updatedAt;

  @belongsTo('vehicle') vehicle;
  @belongsTo('vendor') vendor;
  @belongsTo('fleet') fleet;
  @hasMany('vehicle') vehicles;
}
