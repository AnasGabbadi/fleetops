import Model, { attr } from '@ember-data/model';

export default class MaintenanceRequestModel extends Model {
  @attr('string') publicId;
  @attr('string') companyUuid;
  @attr('string') userUuid;
  @attr('string') vehicleUuid;
  @attr('string') garageUuid;
  @attr('string') appointmentSlotUuid;
  @attr('string') maintenanceType;
  @attr('string') status;
  @attr('string') priority;
  @attr('string') paymentStatus;
  @attr('string') city;
  @attr('string') address;
  @attr('string') notes;
  @attr('string') currency;
  @attr('number') totalProductsCostMad;
  @attr('number') garageServiceCostMad;
  @attr('number') subtotalMad;
  @attr('number') taxMad;
  @attr('number') discountMad;
  @attr('number') totalCostMad;
  @attr('string') scheduledDate;
  @attr('string') scheduledTime;
  @attr('string') customerMessage;
  @attr('string') paymentMethod;
  @attr('string') paymentReference;
  @attr() lineItems;
  @attr() attachments;
  @attr() meta;
  @attr() vehicle;
  @attr() garage;
  @attr() maintenanceItems;
  
  // ✅ Champs pour le tableau
  @attr('string') vehicleLabel;
  @attr('string') garageName;
  @attr('number') productsCount;
  
  @attr('date') createdAt;
  @attr('date') updatedAt;
}
