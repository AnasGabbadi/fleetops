import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ConsoleAdminOrganizationsController extends Controller {
    @service store;
    @service intl;
    @service router;
    @service filters;
    @service crud;
    @service notifications;
    @service modalsManager;

    @tracked query;
    @tracked page = 1;
    @tracked limit = 20;
    @tracked sort = '-created_at';
    @tracked name;
    @tracked country;
    @tracked companies = [];

    queryParams = ['name', 'page', 'limit', 'sort'];

    columns = [
        {
            label: this.intl.t('common.name'),
            valuePath: 'name',
            resizable: true,
            sortable: true,
            filterable: true,
            filterComponent: 'filter/string',
        },
        {
            label: this.intl.t('console.admin.organizations.index.owner-name-column'),
            valuePath: 'owner.name',
            width: '200px',
            resizable: true,
            sortable: true,
        },
        {
            label: this.intl.t('console.admin.organizations.index.owner-email-column'),
            valuePath: 'owner.email',
            width: '200px',
            resizable: true,
            sortable: true,
            filterable: true,
        },
        {
            label: this.intl.t('console.admin.organizations.index.phone-column'),
            valuePath: 'owner.phone',
            width: '200px',
            resizable: true,
            sortable: true,
            filterable: true,
            filterComponent: 'filter/string',
        },
        {
            label: this.intl.t('console.admin.organizations.index.users-count-column'),
            valuePath: 'users_count',
            resizable: true,
            sortable: true,
        },
        {
            label: this.intl.t('common.created-at'),
            valuePath: 'createdAt',
        },
    ];

    @action search(event) {
        this.query = event.target.value ?? '';
        this.page = 1;
    }

    @action goToCompany(company) {
        this.router.transitionTo('console.admin.organizations.index.users', company.public_id);
    }

    @action exportOrganization() {
        const selections = this.table.selectedRows.map((_) => _.id);
        this.crud.export('companies', { params: { selections } });
    }

    @action openCreateOrganization() {
        const org = {
            organization_name: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirm: '',
            showPassword: false
        };

        this.modalsManager.show('modals/create-organization', {
            title: 'Ajouter une organisation',
            acceptButtonText: 'Créer',
            acceptButtonIcon: 'check',
            ...org,
            confirm: async (modal) => {
                modal.startLoading();

                // Validation
                if (!modal.getOption('organization_name')) {
                    this.notifications.warning('Le nom de l\'organisation est obligatoire.');
                    modal.stopLoading();
                    return;
                }

                if (!modal.getOption('email')) {
                    this.notifications.warning('L\'email est obligatoire.');
                    modal.stopLoading();
                    return;
                }

                if (!modal.getOption('password')) {
                    this.notifications.warning('Le mot de passe est obligatoire.');
                    modal.stopLoading();
                    return;
                }

                if (modal.getOption('password') !== modal.getOption('password_confirm')) {
                    this.notifications.warning('Les mots de passe ne correspondent pas.');
                    modal.stopLoading();
                    return;
                }

                try {
                    const response = await fetch('http://localhost:8000/int/v1/auth/sign-up', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user: {
                                name: modal.getOption('name'),
                                email: modal.getOption('email'),
                                password: modal.getOption('password'),
                                password_confirmation: modal.getOption('password_confirm'),
                            },
                            company: {
                                name: modal.getOption('organization_name'),
                            },
                        }),
                    });

                    if (response.ok) {
                        this.notifications.success('Organisation créée avec succès !');
                        this.router.refresh();
                        modal.done();
                    } else {
                        const error = await response.json();
                        this.notifications.serverError(error);
                        modal.stopLoading();
                    }
                } catch (err) {
                    this.notifications.serverError(err);
                    modal.stopLoading();
                }
            },
        });
    }
}