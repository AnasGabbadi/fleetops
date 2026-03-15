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

  @tracked layout = this.appCache.get('fleetops:maintenances:layout', 'table');
  @tracked page = 1;
  @tracked pageSize = 10;
  @tracked query = '';
  @tracked filters = {};
  @tracked table;
  @tracked sort = '-createdAt';

  get columns() {
    return [
      {
        label: 'Véhicule',
        valuePath: 'vehicleLabel',
      },
      {
        label: 'Garage',
        valuePath: 'garageName',
      },
      {
        label: 'Prestation',
        valuePath: 'maintenanceType',
      },
      {
        label: 'Produits',
        valuePath: 'productsCount',
        width: '90px',
      },
      {
        label: 'Coût total (MAD)',
        valuePath: 'totalCostMad',
        textAlign: 'right',
        width: '130px',
      },
      {
        label: 'Statut maintenance',
        valuePath: 'status',
      },
      {
        label: 'Statut paiement',
        valuePath: 'paymentStatus',
      },
      {
        label: 'Date prévue',
        valuePath: 'scheduledDate',
      },
      {
        label: 'Heure',
        valuePath: 'scheduledTime',
        width: '80px',
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

  get bulkActions() {
    return [
      {
        label: 'maintenance.bulk.confirm',
        action: this.bulkConfirmMaintenances,
        icon: 'check',
      },
      {
        label: 'maintenance.bulk.cancel',
        action: this.bulkCancelMaintenances,
        icon: 'trash',
        isDanger: true,
      },
    ];
  }

  @task({ drop: true })
  *controllerSearchTask(query) {
    this.query = query;
    this.page = 1;
    yield this.loadMaintenances.perform();
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

      const maintenances = yield this.store.query('maintenance-request', queryParams);

      return maintenances;
    } catch (error) {
      this.notifications.error('maintenance.errors.loadFailed');
    }
  }

  @action
  exportMaintenances() {
    const csv = this.generateCSV();
    this.downloadCSV(csv, 'maintenances.csv');
    this.notifications.success('maintenance.actions.exported');
  }

  @action
  reloadMaintenances() {
    this.loadMaintenances.perform();
  }

  @action
  bulkConfirmMaintenances(selections) {
    //
  }

  @action
  bulkCancelMaintenances(selections) {
    //
  }

  @action
  filterByStatus(status) {
    if (status) {
      this.filters.status = status;
    } else {
      delete this.filters.status;
    }
    this.page = 1;
    this.loadMaintenances.perform();
  }

  @action
  filterByPaymentStatus(paymentStatus) {
    if (paymentStatus) {
      this.filters.paymentStatus = paymentStatus;
    } else {
      delete this.filters.paymentStatus;
    }
    this.page = 1;
    this.loadMaintenances.perform();
  }

  generateCSV() {
    const model = this.model || [];
    let csv = 'Référence,Véhicule,Garage,Type,Date,Statut,Montant,Paiement\n';

    model.forEach((m) => {
      csv += `${m.publicId},${m.vehicle?.plateNumber || 'N/A'},${m.garage?.name || 'N/A'},${m.maintenanceType},${m.scheduledDate},${m.status},${m.totalCostMad},${m.paymentStatus}\n`;
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

  @action
  search(event) {
    const query = event.target.value;
    this.controllerSearchTask.perform(query);
  }
}
