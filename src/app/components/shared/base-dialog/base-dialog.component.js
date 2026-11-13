import { __decorate } from "tslib";
import { Component, effect, inject, InjectionToken, input, inputBinding, output, viewChild, ViewContainerRef, } from '@angular/core';
import { submit } from '@angular/forms/signals';
import { IonButton, IonButtons, IonFooter, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController, } from '@ionic/angular';
import { close } from 'ionicons/icons';
export const SUBMIT_FORM_TOKEN_LOAD = new InjectionToken('submit.form.token.load');
export const SUBMIT_FORM_TOKEN = new InjectionToken('app.config');
export const successModalEvent = 'successModalEvent';
export const cancelModalEvent = 'cancelModalEvent';
export const closeDialogOnClick = 'closeDialogOnClick';
let BaseDialogComponent = class BaseDialogComponent {
    modalController = inject(ModalController);
    componentContainer = viewChild.required('container', {
        read: ViewContainerRef,
    });
    initValue = input();
    header = input();
    textContent = input('');
    cancelLabel = input();
    submitLabel = input();
    headerTextAlign = input('center');
    data;
    submitClick = output();
    submitComponent = inject(SUBMIT_FORM_TOKEN, { optional: true });
    componentRef;
    dialogClose = output();
    closeIcon = close;
    closeDialog(result) {
        this.dialogClose.emit(result);
        this.modalController.dismiss(closeDialogOnClick, result);
    }
    constructor() {
        effect(() => {
            const container = this.componentContainer();
            const component = this.submitComponent;
            if (!container || !component || this.componentRef) {
                return;
            }
            this.componentRef = container.createComponent(component, {
                bindings: [
                    inputBinding('initValue', () => this.initValue() ? structuredClone(this.initValue()) : this.initValue()),
                ],
            });
            this.componentRef.instance.onClose.subscribe((result) => {
                if (result) {
                    this.closeDialog(successModalEvent);
                }
            });
            // Render the dynamically created component first
            this.componentRef.changeDetectorRef.detectChanges();
            // this.requestAnimation();
        });
    }
    requestAnimation() {
        requestAnimationFrame(() => {
            // this.componentReady.set(true);
        });
    }
    submitForm() {
        if (this.componentRef) {
            submit(this.componentRef.instance.form);
        }
        else {
            this.closeDialog(successModalEvent);
        }
    }
};
BaseDialogComponent = __decorate([
    Component({
        selector: 'app-base-dialog',
        imports: [IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, IonFooter],
        templateUrl: './base-dialog.component.html',
    })
], BaseDialogComponent);
export { BaseDialogComponent };
//# sourceMappingURL=base-dialog.component.js.map