import Model, { attr } from '@ember-data/model';

export default class AppointmentSlotModel extends Model {
  @attr('string') publicId;
  @attr('string') garageUuid;
  @attr('string') date;
  @attr('string') time;
  @attr('boolean') isAvailable;
  @attr('boolean') canBook;
  @attr('number') bookedCount;
  @attr('number') maxCapacity;
  @attr('number') durationMinutes;
  @attr('date') createdAt;
  @attr('date') updatedAt;
}
