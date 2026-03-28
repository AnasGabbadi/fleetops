import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class ManagementMaintenancesIndexController extends Controller {
  @service maintenanceActions;
  @service tableContext;
  @service intl;
  @service appCache;
  @service store;
  @service notifications;
  @service abilities;

  @tracked layout = this.appCache.get('fleetops:maintenances:layout', 'table');
  @tracked page = 1;
  @tracked pageSize = 10;
  @tracked query = '';
  @tracked filters = {};
  @tracked table;
  @tracked sort = '-createdAt';
  @tracked model = [];

  constructor() {
    super(...arguments);
    this.loadMaintenances.perform();
  }

  get columns() {
    return [
      {
        label: 'Véhicule',
        valuePath: 'vehicleUuid',
      },
      {
        label: 'Garage',
        valuePath: 'garageUuid',
      },
      {
        label: 'Prestation',
        valuePath: 'maintenanceType',
        resizable: true,
        sortable: true,
        filterable: true,
      },
      {
        label: 'Coût total (MAD)',
        valuePath: 'totalCostMad',
        textAlign: 'right',
        width: '130px',
        resizable: true,
        sortable: true,
      },
      {
        label: 'Statut maintenance',
        valuePath: 'status',
        cellComponent: 'table/cell/status',
        resizable: true,
        sortable: true,
        filterable: true,
        filterComponent: 'filter/multi-option',
        filterOptions: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      },
      {
        label: 'Statut paiement',
        valuePath: 'paymentStatus',
        cellComponent: 'table/cell/status',
        resizable: true,
        sortable: true,
        filterable: true,
        filterComponent: 'filter/multi-option',
        filterOptions: ['unpaid', 'partial', 'paid', 'refunded'],
      },
      {
        label: 'Date prévue',
        valuePath: 'scheduledDate',
        resizable: true,
        sortable: true,
        filterable: true,
        filterComponent: 'filter/date',
      },
      {
        label: 'Heure',
        valuePath: 'scheduledTime',
        width: '80px',
        resizable: true,
        sortable: true,
      },
      {
        label: '',
        cellComponent: 'table/cell/dropdown',
        ddButtonText: false,
        ddButtonIcon: 'ellipsis-h',
        ddButtonIconPrefix: 'fas',
        cellClassNames: 'overflow-visible',
        wrapperClass: 'flex items-center justify-end mx-2',
        sticky: 'right',
        width: 60,
        actions: [
          {
            label: 'Voir détails',
            fn: this.maintenanceActions.viewMaintenance,
            permission: 'fleet-ops see maintenance-request',
          },
          {
            label: 'Supprimer',
            fn: this.maintenanceActions.deleteMaintenance,
            isDanger: true,
            permission: 'fleet-ops delete maintenance-request',
          },
        ],
      },
    ];
  }

  get actionButtons() {
    return [
      {
        component: 'dropdown-button',
        icon: 'display',
        size: 'xs',
        items: [
          {
            label: 'Vue tableau',
            icon: 'table-list',
            onClick: () => {
              this.layout = 'table';
              this.appCache.set('fleetops:maintenances:layout', 'table');
            },
          },
          {
            label: 'Vue grille',
            icon: 'grip',
            onClick: () => {
              this.layout = 'grid';
              this.appCache.set('fleetops:maintenances:layout', 'grid');
            },
          },
        ],
        renderInPlace: true,
        helpText: 'Changer la mise en page',
      },
      {
        icon: 'refresh',
        onClick: this.reloadMaintenances,
        helpText: 'Actualiser',
      },
      {
        text: 'Nouveau',
        type: 'primary',
        icon: 'plus',
        onClick: this.maintenanceActions.createMaintenance,
      },
      {
        text: 'Exporter',
        icon: 'long-arrow-up',
        wrapperClass: 'hidden md:flex',
        onClick: this.exportMaintenances,
      },
    ];
  }

  @task({ restartable: true })
  *loadMaintenances() {
    try {
      const queryParams = {
        page: this.page,
        limit: this.pageSize,
        sort: this.sort,
      };

      if (this.query) {
        queryParams.query = this.query;
      }

      Object.assign(queryParams, this.filters);

      this.model = yield this.store.query('maintenance-request', queryParams);
      return this.model;
    } catch (error) {
      console.error('❌ ERREUR:', error);
      this.notifications.error('Erreur chargement maintenances');
    }
  }

  @action
  exportMaintenances() {
    const csv = this.generateCSV();
    this.downloadCSV(csv, 'maintenances.csv');
    this.notifications.success('Données exportées');
  }

  @action
  reloadMaintenances() {
    this.loadMaintenances.perform();
  }

  generateCSV() {
    const model = this.model || [];
    let csv = 'Référence,Véhicule,Garage,Type,Date,Statut,Montant,Paiement\n';
    model.forEach((m) => {
      csv += `${m.publicId},${m.vehicleLabel || 'N/A'},${m.garageName || 'N/A'},${m.maintenanceType},${m.scheduledDate},${m.status},${m.totalCostMad},${m.paymentStatus}\n`;
    });
    return csv;
  }

  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
