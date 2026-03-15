import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import fleetOpsOptions from '../../../utils/fleet-ops-options';

export default class ManagementFleetsIndexController extends Controller {
    @service fleetActions;
    @service serviceAreaActions;
    @service zoneActions;
    @service vendorActions;
    @service tableContext;
    @service intl;
    @service store;

    /** query params */
    @tracked queryParams = ['page', 'limit', 'sort', 'query', 'public_id', 'zone', 'service_area', 'parent_fleet', 'vendor', 'created_by', 'updated_by', 'status', 'task', 'name'];
    @tracked page = 1;
    @tracked limit;
    @tracked sort = '-created_at';
    @tracked public_id;
    @tracked service_area;
    @tracked parent_fleet;
    @tracked vendor;
    @tracked zone;
    @tracked task;
    @tracked name;
    @tracked status;
    @tracked table;
    
    /** action buttons */
    get actionButtons() {
        return [
            {
                icon: 'refresh',
                onClick: this.fleetActions.refresh,
                helpText: this.intl.t('common.refresh'),
            },
            {
                text: this.intl.t('common.new'),
                type: 'primary',
                icon: 'plus',
                onClick: this.fleetActions.transition.create,
            },
            {
                text: this.intl.t('common.import'),
                type: 'magic',
                icon: 'upload',
                onClick: this.fleetActions.import,
            },
            {
                text: this.intl.t('common.export'),
                icon: 'long-arrow-up',
                iconClass: 'rotate-icon-45',
                wrapperClass: 'hidden md:flex',
                onClick: this.fleetActions.export,
            },
        ];
    }

    /** bulk actions */
    get bulkActions() {
        const selected = this.tableContext.getSelectedRows();

        return [
            {
                label: this.intl.t('common.delete-selected-count', { count: selected.length }),
                class: 'text-red-500',
                fn: this.fleetActions.bulkDelete,
            },
        ];
    }

    /** columns */
    get columns() {
        return [
            {
                sticky: true,
                label: this.intl.t('column.name'),
                valuePath: 'name',
                cellComponent: 'table/cell/anchor',
                permission: 'fleet-ops view fleet',
                action: this.fleetActions.transition.view,
                resizable: true,
                sortable: true,
                filterable: true,
                filterParam: 'name',
                filterComponent: 'filter/string',
            },
            {
                label: 'Niveau de flotte',
                valuePath: 'fleet_level',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/multi-option',
                filterOptions: [
                    { label: 'PAYS', value: 'PAYS' },
                    { label: 'VILLE', value: 'VILLE' },
                ],
            },
            {
                label: 'Pays',
                valuePath: 'country',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/string',
            },
            {
                label: 'Ville',
                valuePath: 'city',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/string',
            },
            {
                label: this.intl.t('column.parent-fleet'),
                cellComponent: 'table/cell/anchor',
                permission: 'fleet-ops view fleet',
                action: async (fleet) => {
                    const parentFleet = await fleet.get('parent_fleet');
                    this.fleetActions.modal.view(parentFleet);
                },
                valuePath: 'parent_fleet.name',
                resizable: true,
                filterable: true,
                filterComponent: 'filter/model',
                filterComponentPlaceholder: 'Select fleet',
                filterParam: 'parent_fleet_uuid',
                model: 'fleet',
            },
            {
                label: 'Véhicules',
                valuePath: 'vehicles_count',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: false,
            },
            {
                label: this.intl.t('column.status'),
                valuePath: 'status',
                cellComponent: 'table/cell/status',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/multi-option',
                filterOptionLabel: 'label',
                filterOptionValue: 'value',
                filterOptions: fleetOpsOptions('fleetStatuses'),
            },
            {
                label: this.intl.t('column.created-at'),
                valuePath: 'createdAt',
                sortParam: 'created_at',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/date',
            },
            {
                label: this.intl.t('column.updated-at'),
                valuePath: 'updatedAt',
                sortParam: 'updated_at',
                resizable: true,
                sortable: true,
                hidden: true,
                filterable: true,
                filterComponent: 'filter/date',
            },
            {
                label: '',
                cellComponent: 'table/cell/dropdown',
                ddButtonText: false,
                ddButtonIcon: 'ellipsis-h',
                ddButtonIconPrefix: 'fas',
                ddMenuLabel: this.intl.t('common.resource-actions', { resource: this.intl.t('resource.fleet') }),
                cellClassNames: 'overflow-visible',
                wrapperClass: 'flex items-center justify-end mx-2',
                sticky: 'right',
                width: 60,
                actions: [
                    {
                        label: this.intl.t('common.view-resource', { resource: this.intl.t('resource.fleet') }),
                        fn: this.fleetActions.transition.view,
                        permission: 'fleet-ops view fleet',
                    },
                    {
                        label: this.intl.t('common.edit-resource', { resource: this.intl.t('resource.fleet') }),
                        fn: this.fleetActions.transition.edit,
                        permission: 'fleet-ops update fleet',
                    },
                    {
                        label: 'Attribuer des véhicules à la flotte',
                        fn: this.fleetActions.assignVehicles,
                        permission: 'fleet-ops update fleet',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: this.intl.t('common.delete-resource', { resource: this.intl.t('resource.fleet') }),
                        fn: this.fleetActions.delete,
                        permission: 'fleet-ops delete fleet',
                    },
                ],
                sortable: false,
                filterable: false,
                resizable: false,
                searchable: false,
            },
        ];
    }
}
