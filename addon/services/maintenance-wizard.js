import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * Service de gestion du Wizard Maintenance
 * Gère l'état des 4 étapes du wizard
 */
export default class MaintenanceWizardService extends Service {
  @tracked currentStep = 1; // 1, 2, 3, 4
  @tracked isCompleted = false;

  // ======= ÉTAPE 1: Sélection véhicule =======
  @tracked selectedVehicle = null;
  @tracked selectedMaintenanceType = null;
  @tracked selectedCity = null;

  // ======= ÉTAPE 2: Produits =======
  @tracked cartItems = []; // Produits sélectionnés
  @tracked cartTotal = 0;

  // ======= ÉTAPE 3: Garage =======
  @tracked selectedGarage = null;
  @tracked selectedAppointmentSlot = null;
  @tracked selectedDate = null;
  @tracked selectedTime = null;

  // ======= ÉTAPE 4: Résumé =======
  @tracked customerNotes = '';
  @tracked promoCode = '';
  @tracked discountAmount = 0;
  @tracked finalTotal = 0;

  // ======= ACTIONS =======

  @action
  goToStep(step) {
    if (step >= 1 && step <= 4) {
      this.currentStep = step;
    }
  }

  @action
  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep += 1;
    }
  }

  @action
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  // ======= ÉTAPE 1 =======

  @action
  setVehicle(vehicle) {
    this.selectedVehicle = vehicle;
  }

  @action
  setMaintenanceType(type) {
    this.selectedMaintenanceType = type;
  }

  @action
  setCity(city) {
    this.selectedCity = city;
  }

  get isStep1Valid() {
    return this.selectedVehicle && this.selectedMaintenanceType && this.selectedCity;
  }

  // ======= ÉTAPE 2 =======

  @action
  addToCart(product, quantity = 1) {
    const existingItem = this.cartItems.findBy('id', product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.pushObject({
        id: product.id,
        product: product,
        name: product.name,
        sku: product.sku,
        price: product.priceMad,
        quantity: quantity,
        totalPrice: product.priceMad * quantity
      });
    }

    this.updateCartTotal();
  }

  @action
  removeFromCart(itemId) {
    const item = this.cartItems.findBy('id', itemId);
    if (item) {
      this.cartItems.removeObject(item);
      this.updateCartTotal();
    }
  }

  @action
  updateCartItemQuantity(itemId, quantity) {
    const item = this.cartItems.findBy('id', itemId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      item.totalPrice = item.price * quantity;
      this.updateCartTotal();
    }
  }

  @action
  clearCart() {
    this.cartItems = [];
    this.cartTotal = 0;
  }

  updateCartTotal() {
    this.cartTotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.totalPrice || 0);
    }, 0);
  }

  get isStep2Valid() {
    return this.cartItems.length > 0;
  }

  get cartItemsCount() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ======= ÉTAPE 3 =======

  @action
  setGarage(garage) {
    this.selectedGarage = garage;
  }

  @action
  setAppointmentSlot(slot) {
    this.selectedAppointmentSlot = slot;
    if (slot) {
      this.selectedDate = slot.date;
      this.selectedTime = slot.time;
    }
  }

  get isStep3Valid() {
    return this.selectedGarage && this.selectedAppointmentSlot;
  }

  // ======= ÉTAPE 4 =======

  @action
  setCustomerNotes(notes) {
    this.customerNotes = notes;
  }

  @action
  applyPromoCode(code) {
    this.promoCode = code;
    // La validation du code promo se fait via API
  }

  @action
  setDiscountAmount(amount) {
    this.discountAmount = amount;
    this.calculateFinalTotal();
  }

  calculateFinalTotal() {
    const garagePrice = this.selectedGarage?.basePriceMad || 0;
    const subtotal = this.cartTotal + garagePrice;
    const tax = subtotal * 0.1; // TVA 10%
    this.finalTotal = subtotal + tax - this.discountAmount;
  }

  get isStep4Valid() {
    return this.selectedVehicle && this.selectedGarage && this.cartItems.length > 0;
  }

  // ======= RÉSUMÉ COMPLET =======

  get wizardSummary() {
    return {
      // Véhicule
      vehicle: this.selectedVehicle,
      maintenanceType: this.selectedMaintenanceType,
      city: this.selectedCity,

      // Produits
      items: this.cartItems,
      productsCost: this.cartTotal,

      // Garage
      garage: this.selectedGarage,
      appointmentSlot: this.selectedAppointmentSlot,
      appointmentDate: this.selectedDate,
      appointmentTime: this.selectedTime,
      serviceCost: this.selectedGarage?.basePriceMad || 0,

      // Coûts
      subtotal: this.cartTotal + (this.selectedGarage?.basePriceMad || 0),
      tax: (this.cartTotal + (this.selectedGarage?.basePriceMad || 0)) * 0.1,
      discount: this.discountAmount,
      total: this.finalTotal,

      // Notes
      notes: this.customerNotes,
      promoCode: this.promoCode
    };
  }

  // ======= RESET =======

  @action
  resetWizard() {
    this.currentStep = 1;
    this.isCompleted = false;

    // Step 1
    this.selectedVehicle = null;
    this.selectedMaintenanceType = null;
    this.selectedCity = null;

    // Step 2
    this.cartItems = [];
    this.cartTotal = 0;

    // Step 3
    this.selectedGarage = null;
    this.selectedAppointmentSlot = null;
    this.selectedDate = null;
    this.selectedTime = null;

    // Step 4
    this.customerNotes = '';
    this.promoCode = '';
    this.discountAmount = 0;
    this.finalTotal = 0;
  }

  @action
  completeWizard() {
    this.isCompleted = true;
  }
}