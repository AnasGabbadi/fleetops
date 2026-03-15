import Model, { attr, hasMany } from '@ember-data/model';

export default class DriverModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') email;
  @attr('string') phone;

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  @hasMany('vehicle') vehicles;
}
