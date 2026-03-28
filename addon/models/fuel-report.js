import Model, { attr, belongsTo } from '@ember-data/model';

export default class FuelReportModel extends Model {
    @attr('string') publicId;
    @attr('string') reporterUuid;
    @attr('string') driverUuid;
    @attr('string') vehicleUuid;
    @attr('string') reporterName;
    @attr('string') driverName;
    @attr('string') vehicleName;
    @attr('string') odometer;
    @attr('string') amount;
    @attr('string') currency;
    @attr('string') volume;
    @attr('string') metricUnit;
    @attr('string') type;
    @attr('string') status;
    @attr('string') report;
    @attr('date') createdAt;
    @attr('date') updatedAt;
    
    // Nouveaux attributs pour l'image
    @attr('string') receiptImage;
    @attr('string') receiptImageUrl;
    
    // Relations
    @belongsTo('driver') driver;
    @belongsTo('vehicle') vehicle;
}