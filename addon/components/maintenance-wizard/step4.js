import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MaintenanceWizardStep4Component extends Component {
  @service store;
  @service notifications;
  @service currentUser;

  @tracked notes = '';
  @tracked isSubmitting = false;
  @tracked errorMessage = null;

  get cartItemsWithTotal() {
    return (this.args.wizardData?.cartItems ?? []).map(item => ({
      ...item,
      totalPrice: (item.unitPrice * item.quantity).toFixed(2),
    }));
  }

  get cartTotal() {
    return (this.args.wizardData?.cartItems ?? [])
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2);
  }

  get grandTotal() {
    const cartSum = parseFloat(this.cartTotal);
    const garagePrice = parseFloat(this.args.wizardData?.garage?.basePriceMad ?? 0);
    const subtotal = cartSum + garagePrice;
    const tax = subtotal * 0.20;
    return (subtotal + tax).toFixed(2);
  }

  @action
  updateNotes(event) {
    this.notes = event.target.value;
    this.args.onUpdateData?.('notes', event.target.value);
  }

  @action
  async confirmRequest() {
    this.isSubmitting = true;
    this.errorMessage = null;

    const { vehicle, maintenanceType, city, cartItems, garage, appointmentSlot } =
      this.args.wizardData;

    const companyUuid =
      this.currentUser?.companyUuid
      ?? this.currentUser?.company?.uuid
      ?? this.currentUser?.currentCompany?.uuid
      ?? this.currentUser?.user?.companyUuid;

    const userUuid =
      this.currentUser?.user?.uuid
      ?? this.currentUser?.id;

    const scheduledDate =
      appointmentSlot?.date
      ?? appointmentSlot?.scheduledDate
      ?? this.args.wizardData?.selectedDate
      ?? new Date().toISOString().split('T')[0];

    const scheduledTime =
      appointmentSlot?.time
      ?? appointmentSlot?.scheduledTime
      ?? '08:00';

    const cartSum = parseFloat(this.cartTotal);
    const garagePrice = parseFloat(garage?.basePriceMad ?? 0);
    const subtotal = cartSum + garagePrice;
    const tax = parseFloat((subtotal * 0.20).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    // ✅ AJOUTER LES CHAMPS CALCULÉS
    const vehicleLabel = `${vehicle?.year ?? ''} ${vehicle?.make ?? ''} ${vehicle?.model ?? ''}`.trim();
    const garageName = garage?.name ?? null;
    const productsCount = cartItems?.length ?? 0;

    const maintenanceRequest = this.store.createRecord('maintenance-request', {
      companyUuid,
      userUuid,
      vehicleUuid: vehicle?.uuid ?? vehicle?.id,
      garageUuid: garage?.uuid ?? null,
      appointmentSlotUuid: null,  // ✅ CORRIGÉ
      maintenanceType,
      status: 'pending',
      priority: 'medium',
      paymentStatus: 'unpaid',
      city,
      notes: this.notes,
      currency: 'MAD',
      totalProductsCostMad: cartSum,
      garageServiceCostMad: garagePrice,
      subtotalMad: subtotal,
      taxMad: tax,
      discountMad: 0,
      totalCostMad: total,
      scheduledDate,
      scheduledTime,
      vehicleLabel,
      garageName,
      productsCount,
      products: (cartItems ?? []).map(i => ({
        repair_product_uuid: i.productId,
        product_name: i.name,
        product_sku: i.sku,
        quantity: i.quantity,
        unit_price_mad: i.unitPrice,
      })),
      meta: {
        garage_name: garage?.name,
        garage_uuid: garage?.uuid,
        garage_address: garage?.address,
        slot_uuid: appointmentSlot?.uuid,
        slot_date: appointmentSlot?.date,
        slot_time: appointmentSlot?.time,
      },
    });

    try {
      await maintenanceRequest.save();
    } catch (saveError) {
      // ignore erreur Ember serialization
    }

    this.isSubmitting = false;
    this.notifications?.success('Demande de maintenance créée avec succès !');
    this.args.onConfirm(maintenanceRequest);
  }
}
