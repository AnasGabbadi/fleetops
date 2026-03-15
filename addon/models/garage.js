import Model, { attr } from '@ember-data/model';

export default class GarageModel extends Model {
  @attr('string') publicId;
  @attr('string') name;
  @attr('string') description;
  @attr('string') phone;
  @attr('string') email;
  @attr('string') address;
  @attr('string') city;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr('number') basePriceMad;
  @attr('string') currency;
  @attr('string') formattedPrice;
  @attr() servicesOffered;
  @attr('boolean') isActive;
  @attr('string') workingHoursStart;
  @attr('string') workingHoursEnd;
  @attr('number') rating;
  @attr('string') formattedRating;
  @attr('date') createdAt;
  @attr('date') updatedAt;
}
