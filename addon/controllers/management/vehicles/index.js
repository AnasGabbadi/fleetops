import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ManagementVehiclesIndexController extends Controller {
    @service vehicleActions;
    @service driverActions;
    @service tableContext;
    @service intl;
    @service appCache;

    /** query params */
    @tracked queryParams = [
        'page',
        'limit',
        'sort',
        'query',
        'public_id',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'name',
        'plate_number',
        'year',
        'vehicle_make',
        'vehicle_model',
        'display_name',
    ];
    @tracked query = null;
    @tracked page = 1;
    @tracked limit;
    @tracked sort = '-created_at';
    @tracked public_id;
    @tracked status;
    @tracked name;
    @tracked plate_number;
    @tracked vehicle_make;
    @tracked vehicle_model;
    @tracked year;
    @tracked country;
    @tracked fleet;
    @tracked vendor;
    @tracked driver;
    @tracked display_name;
    @tracked table;
    @tracked layout = this.appCache.get('fleetops:vehicles:layout', 'table');

    /** action buttons */
    /* eslint-disable ember/no-side-effects */
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
                            this.appCache.set('fleetops:vehicles:layout', 'table');
                        },
                    },
                    {
                        label: 'Vue grille',
                        icon: 'grip',
                        onClick: () => {
                            this.layout = 'grid';
                            this.appCache.set('fleetops:vehicles:layout', 'grid');
                        },
                    },
                ],
                renderInPlace: true,
                helpText: 'Changer la mise en page',
            },
            {
                icon: 'refresh',
                onClick: this.vehicleActions.refresh,
                helpText: 'Actualiser',
            },
            {
                text: 'Nouveau',
                type: 'primary',
                icon: 'plus',
                onClick: this.vehicleActions.transition.create,
            },
            {
                text: 'Importer',
                type: 'magic',
                icon: 'upload',
                onClick: this.vehicleActions.import,
            },
            {
                text: 'Exporter',
                icon: 'long-arrow-up',
                iconClass: 'rotate-icon-45',
                wrapperClass: 'hidden md:flex',
                onClick: this.vehicleActions.export,
            },
        ];
    }

    /** bulk actions */
    get bulkActions() {
        const selected = this.tableContext.getSelectedRows();

        return [
            {
                label: `Supprimer ${selected.length} sélectionné(s)`,
                class: 'text-red-500',
                fn: this.vehicleActions.bulkDelete,
            },
        ];
    }

    /** columns */
    get columns() {
        return [
            {
                sticky: true,
                label: 'Nom',
                valuePath: 'displayName',
                photoPath: 'avatar_url',
                cellComponent: 'table/cell/vehicle-name',
                permission: 'fleet-ops view vehicle',
                action: this.vehicleActions.transition.view,
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/string',
                filterParam: 'name',
                showOnlineIndicator: true,
            },
            {
                label: 'Immatriculation',
                valuePath: 'plate_number',
                cellComponent: 'table/cell/base',
                action: this.vehicleActions.transition.view,
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/string',
                filterParam: 'plate_number',
            },
            // {
            //     label: 'ID interne',
            //     valuePath: 'internal_id',
            //     cellComponent: 'table/cell/base',
            //     resizable: true,
            //     sortable: true,
            //     filterable: true,
            //     hidden: true,
            //     filterComponent: 'filter/string',
            //     filterParam: 'internal_id',
            // },
            {
                label: 'Conducteur',
                cellComponent: 'table/cell/anchor',
                permission: 'fleet-ops view driver',
                action: async (vehicle) => {
                    const driver = await vehicle.loadDriver();
                    return this.driverActions.panel.view(driver);
                },
                valuePath: 'driver_name',
                resizable: true,
                filterable: true,
                filterComponent: 'filter/model',
                filterComponentPlaceholder: 'Sélectionner un conducteur',
                filterParam: 'driver',
                model: 'driver',
            },
            // {
            //     label: 'ID',
            //     valuePath: 'public_id',
            //     cellComponent: 'click-to-copy',
            //     hidden: true,
            //     resizable: true,
            //     sortable: true,
            //     filterable: true,
            //     filterComponent: 'filter/string',
            // },
            {
                label: 'Marque',
                valuePath: 'make',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterParam: 'make',
                filterComponent: 'filter/string',
            },
            {
                label: 'Modèle',
                valuePath: 'model',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterParam: 'model',
                filterComponent: 'filter/string',
            },
            {
                label: 'Année',
                valuePath: 'year',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/string',
            },
            {
                label: 'Version',
                valuePath: 'version',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/string',
            },
            {
                label: 'Kilométrage',
                valuePath: 'odometer',
                cellComponent: 'table/cell/base',
                resizable: true,
                sortable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Carburant',
                valuePath: 'fuel_type',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Carrosserie',
                valuePath: 'body_type',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Propriété',
                valuePath: 'ownership_type',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: "Acquisition",
                valuePath: 'acquisition_cost',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Exp assurance',
                valuePath: 'assurance_expiry',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Exp vignette',
                valuePath: 'vignette_expiry',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Exp visite technique',
                valuePath: 'visite_technique_expiry',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            {
                label: 'Exp carte grise',
                valuePath: 'carte_grise_expiry',
                cellComponent: 'table/cell/base',
                resizable: true,
                hidden: true,
                filterable: false,
            },
            // {
            //     label: '',
            //     cellComponent: 'table/cell/anchor',
            //     permission: 'fleet-ops view vendor',
            //     action: async ({ vendor_uuid }) => {
            //         const vendor = await this.store.findRecord('vendor', vendor_uuid);
            //         this.vendorActions.viewVendor(vendor);
            //     },
            //     valuePath: 'vendor_name',
            //     hidden: true,
            //     hideable: false,
            //     resizable: true,
            //     filterable: false,
            //     filterComponent: 'filter/model',
            //     filterParam: 'vendor',
            //     model: 'vendor',
            // },
            {
                label: 'Statut',
                valuePath: 'status',
                cellComponent: 'table/cell/status',
                resizable: true,
                sortable: true,
                filterable: true,
                filterComponent: 'filter/multi-option',
                filterFetchOptions: 'vehicles/statuses',
            },
            {
                label: 'Créé le',
                valuePath: 'createdAt',
                sortParam: 'created_at',
                resizable: true,
                sortable: true,
                hidden: true,
                filterable: true,
                filterParam: 'created_at',
                filterLabel: 'Créé entre',
                filterComponent: 'filter/date',
            },
            {
                label: 'Modifié le',
                valuePath: 'updatedAt',
                sortParam: 'updated_at',
                resizable: true,
                sortable: true,
                hidden: true,
                filterParam: 'updated_at',
                filterLabel: 'Modifié entre',
                filterable: true,
                filterComponent: 'filter/date',
            },
            {
                label: '',
                cellComponent: 'table/cell/dropdown',
                ddButtonText: false,
                ddButtonIcon: 'ellipsis-h',
                ddButtonIconPrefix: 'fas',
                ddMenuLabel: 'Actions véhicule',
                cellClassNames: 'overflow-visible',
                wrapperClass: 'flex items-center justify-end mx-2',
                sticky: 'right',
                width: 60,
                actions: [
                    {
                        label: 'Voir le véhicule',
                        fn: this.vehicleActions.transition.view,
                        permission: 'fleet-ops view vehicle',
                    },
                    {
                        label: 'Modifier le véhicule',
                        fn: this.vehicleActions.transition.edit,
                        permission: 'fleet-ops update vehicle',
                    },
                    {
                        label: 'Localiser le véhicule',
                        fn: this.vehicleActions.locate,
                        permission: 'fleet-ops view vehicle',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'Supprimer le véhicule',
                        fn: this.vehicleActions.delete,
                        permission: 'fleet-ops delete vehicle',
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