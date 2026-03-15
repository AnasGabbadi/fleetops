import RESTSerializer from '@ember-data/serializer/rest';

export default class MaintenanceRequestSerializer extends RESTSerializer {
  primaryKey = 'id';

  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    const items = payload.maintenanceRequests || [];

    return {
      data: items.map((item) => {
        const vehicle = item.vehicle || {};
        const garage  = item.garage || {};
        const maintenanceItems = item.maintenanceItems || [];

        return {
          id: item.id ?? item.publicId,
          type: primaryModelClass.modelName,
          attributes: {
            publicId:             item.publicId,
            vehicleUuid:          item.vehicleUuid,
            garageUuid:           item.garageUuid,
            appointmentSlotUuid:  item.appointmentSlotUuid,
            maintenanceType:      item.maintenanceType,
            status:               item.status,
            priority:             item.priority,
            paymentStatus:        item.paymentStatus,
            city:                 item.city,
            address:              item.address,
            notes:                item.notes,
            currency:             item.currency,
            totalProductsCostMad: item.totalProductsCostMad,
            garageServiceCostMad: item.garageServiceCostMad,
            subtotalMad:          item.subtotalMad,
            taxMad:               item.taxMad,
            discountMad:          item.discountMad,
            totalCostMad:         item.totalCostMad,
            scheduledDate:        item.scheduledDate,
            scheduledTime:        item.scheduledTime,
            customerMessage:      item.customerMessage,
            paymentMethod:        item.paymentMethod,
            createdAt:            item.createdAt,
            updatedAt:            item.updatedAt,

            // objets complets (si tu en as besoin ailleurs)
            vehicle,
            garage,
            maintenanceItems,

            // 🔹 Champs plats pour le tableau
            vehicleLabel:  item.vehicleLabel,
            garageName:    item.garageName,
            productsCount: item.productsCount,
          },
        };
      }),
      meta: payload.meta,
    };
  }

  normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
    const item = payload.maintenanceRequest || payload;
    return this.normalizeArrayResponse(
      store,
      primaryModelClass,
      { maintenanceRequests: [item] },
      id,
      requestType
    );
  }
}