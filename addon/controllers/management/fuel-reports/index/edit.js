import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class ManagementFuelReportsIndexEditController extends Controller {
    @service hostRouter;
    @service intl;
    @service notifications;
    @service modalsManager;
    @service events;
    @service fetch;

    @tracked overlay;
    @tracked formComponent;
    @tracked actionButtons = [
        {
            icon: 'eye',
            fn: this.view,
        },
    ];

    @action setFormComponent(component) {
        this.formComponent = component;
    }

    @task *save(fuelReport) {
        try {
            yield fuelReport.save();

            if (this.formComponent?.receiptImageFile) {
                yield this.uploadReceiptImage(fuelReport, this.formComponent.receiptImageFile);
            }

            if (
                this.formComponent?.receiptImagePreview === null &&
                !this.formComponent?.receiptImageFile
            ) {
                fuelReport.set('receipt_image', null);
                fuelReport.set('receipt_image_url', null);
                yield fuelReport.save();
            }

            this.events.trackResourceUpdated(fuelReport);
            this.overlay?.close();

            yield this.hostRouter.transitionTo('console.fleet-ops.management.fuel-reports.index.details', fuelReport);
            this.notifications.success(
                this.intl.t('common.resource-updated-success', {
                    resource: this.intl.t('resource.fuel-report'),
                    resourceName: fuelReport.public_id,
                })
            );
        } catch (err) {
            this.notifications.serverError(err);
        }
    }

    async uploadReceiptImage(fuelReport, imageFile) {
        try {
            const formData = new FormData();
            formData.append('receipt_image', imageFile, imageFile.name);

            // ✅ Même que new.js — supprimer Content-Type pour FormData
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

            if (data.fuel_report?.receipt_image_url) {
                fuelReport.set('receipt_image', data.fuel_report.receipt_image);
                fuelReport.set('receipt_image_url', data.fuel_report.receipt_image_url);
            }
        } catch (error) {
            this.notifications.warning('Le rapport a été mis à jour mais l\'image n\'a pas pu être uploadée');
        }
    }

    @action cancel() {
        if (this.model.hasDirtyAttributes) {
            return this.#confirmContinueWithUnsavedChanges(this.model);
        }
        return this.hostRouter.transitionTo('console.fleet-ops.management.fuel-reports.index');
    }

    @action view() {
        if (this.model.hasDirtyAttributes) {
            return this.#confirmContinueWithUnsavedChanges(this.model);
        }
        return this.hostRouter.transitionTo('console.fleet-ops.management.fuel-reports.index.details', this.model);
    }

    #confirmContinueWithUnsavedChanges(fuelReport, options = {}) {
        return this.modalsManager.confirm({
            title: this.intl.t('common.continue-without-saving'),
            body: this.intl.t('common.continue-without-saving-prompt', { resource: this.intl.t('resource.fuel-report') }),
            acceptButtonText: this.intl.t('common.continue'),
            confirm: async () => {
                fuelReport.rollbackAttributes();
                await this.hostRouter.transitionTo('console.fleet-ops.management.fuel-reports.index.details', fuelReport);
            },
            ...options,
        });
    }
}
