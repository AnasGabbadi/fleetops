import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MaintenanceWizardStep3Component extends Component {
  @service garageIntegration;

  @tracked selectedGarageUuid = '';
  @tracked selectedSlotUuid = '';
  @tracked selectedSlotTime = '';
  @tracked selectedDate = new Date().toISOString().split('T')[0];
  @tracked availableSlots = [];
  @tracked isLoadingSlots = false;
  @tracked filterCity = '';
  @tracked sortBy = 'rating';
  @tracked searchTerm = '';

  constructor() {
    super(...arguments);
    if (this.args.city) {
      this.filterCity = this.args.city;
    }
    this.garageIntegration.loadGarages();
  }

  get cartTotal() {
    if (!this.args.cartItems?.length) return '0.00';
    return this.args.cartItems
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2);
  }

  get citiesList() {
    return this.garageIntegration.citiesList ?? [];
  }

  get isLoading() {
    return this.garageIntegration.isLoading;
  }

  get selectedGarageName() {
    const garage = (this.garageIntegration.garages ?? [])
      .find(g => g.uuid === this.selectedGarageUuid);
    return garage?.name ?? '';
  }

  get filteredGarages() {
    let garages = this.garageIntegration.garages ?? [];

    if (this.filterCity) {
      garages = garages.filter(g =>
        g.city?.toLowerCase() === this.filterCity.toLowerCase()
      );
    }

    if (this.searchTerm) {
      garages = garages.filter(g =>
        g.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        g.address?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return [...garages].sort((a, b) => {
      if (this.sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      if (this.sortBy === 'price') return (a.basePriceMad ?? 0) - (b.basePriceMad ?? 0);
      if (this.sortBy === 'name') return a.name?.localeCompare(b.name, 'fr');
      return 0;
    });
  }

  get isStep3Valid() {
    return this.selectedGarageUuid && this.selectedSlotUuid;
  }

  @action
  updateSearch(event) {
    this.searchTerm = event.target.value;
  }

  @action
  updateCity(event) {
    this.filterCity = event.target.value;
  }

  @action
  setSortBy(sort) {
    this.sortBy = sort;
  }

  @action
  async selectGarage(garage) {
    // Toggle — cliquer sur le même garage le désélectionne
    if (this.selectedGarageUuid === garage.uuid) {
      this.selectedGarageUuid = '';
      this.selectedSlotUuid = '';
      this.selectedSlotTime = '';
      this.availableSlots = [];
      return;
    }
    this.selectedGarageUuid = garage.uuid;
    this.selectedSlotUuid = '';
    this.selectedSlotTime = '';
    this.args.onUpdateData('garage', garage);
    await this.loadSlots();
  }

  @action
  async updateDate(event) {
    this.selectedDate = event.target.value;
    await this.loadSlots();
  }

  @action
  selectSlot(slot) {
    this.selectedSlotUuid = slot.uuid;
    this.selectedSlotTime = slot.time;
    this.args.onUpdateData('appointmentSlot', slot);
  }

  async loadSlots() {
    if (!this.selectedGarageUuid || !this.selectedDate) return;
    try {
      this.isLoadingSlots = true;
      this.availableSlots = await this.garageIntegration
        .loadAvailableSlotsForDate(this.selectedGarageUuid, this.selectedDate);
    } catch (error) {
      console.error('Erreur slots:', error);
      this.availableSlots = [];
    } finally {
      this.isLoadingSlots = false;
    }
  }
}
