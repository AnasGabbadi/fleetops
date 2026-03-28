import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class ManagementFuelReportsIndexNewController extends Controller {
    @service fuelReportActions;
    @service currentUser;
    @service hostRouter;
    @service intl;
    @service notifications;
    @service events;
    @service fetch;

    @tracked overlay;
    @tracked fuelReport = this.fuelReportActions.createNewInstance({});
    @tracked formComponent;

    @task *save(fuelReport) {
        try {
            yield fuelReport.save();
            this.events.trackResourceCreated(fuelReport);

            if (this.formComponent?.receiptImageFile) {
                yield this.uploadReceiptImage(fuelReport, this.formComponent.receiptImageFile);
            }

            this.overlay?.close();
            yield this.hostRouter.refresh();
            yield this.hostRouter.transitionTo(
                'console.fleet-ops.management.fuel-reports.index.details',
                { public_id: fuelReport.publicId }
            );

            this.notifications.success(
                this.intl.t('common.resource-created-success-name', {
                    resource: this.intl.t('resource.fuel-report'),
                    resourceName: fuelReport.public_id,
                })
            );

            this.resetForm();
        } catch (err) {
            this.notifications.serverError(err);
        }
    }

    async uploadReceiptImage(fuelReport, imageFile) {
        try {
            const formData = new FormData();
            formData.append('receipt_image', imageFile, imageFile.name);

            const allHeaders = this.fetch.getHeaders();
            const { 'Content-Type': _, ...headersWithoutContentType } = allHeaders;

            const response = await window.fetch(
                `http://localhost:8000/int/v1/fuel-reports/${fuelReport.id}/upload-receipt`,
                {
                    method: 'POST',
                    headers: headersWithoutContentType,
                    body: formData,
                }
            );

            const data = await response.json();

            // ✅ snake_case — correspond au modèle Ember
            if (data.fuel_report?.receipt_image_url) {
                fuelReport.set('receipt_image', data.fuel_report.receipt_image);
                fuelReport.set('receipt_image_url', data.fuel_report.receipt_image_url);
            }
        } catch (error) {
            this.notifications.warning('Le rapport a été créé mais l\'image n\'a pas pu être uploadée');
        }
    }

    @action setFormComponent(component) {
        this.formComponent = component;
    }

    @action resetForm() {
        this.fuelReport = this.fuelReportActions.createNewInstance({});
        this.formComponent = null;
    }
}