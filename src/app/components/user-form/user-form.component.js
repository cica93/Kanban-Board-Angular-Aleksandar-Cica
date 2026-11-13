import { __decorate } from "tslib";
import { Component, forwardRef, input, output, signal } from '@angular/core';
import { AddressFormComponent, addressSchema, } from '../address-form/address-form.component';
import { apply, form, FormRoot, minLength, required } from '@angular/forms/signals';
import { SUBMIT_FORM_TOKEN } from '../shared/base-dialog/base-dialog.component';
import { Subject } from 'rxjs';
let UserFormComponent = class UserFormComponent {
    initValue = input(null);
    onClose = new Subject();
    submitted = signal(false);
    formSubmitted = output();
    userModel = signal({
        name: '',
        address: { street: '', city: '', zipCode: '' },
        billingAddress: { street: '', city: '', zipCode: '' },
    });
    form = form(this.userModel, (path) => {
        required(path.name, { message: 'name is required' });
        minLength(path.name, 3, {
            message: 'name should have the least 3 characters',
        });
        apply(path.address, addressSchema());
        apply(path.billingAddress, addressSchema());
    }, {
        submission: {
            action: async () => {
                this.formSubmitted.emit(this.form().value);
                //this.closeModal();
            },
            onInvalid: () => {
                this.form().markAsTouched();
                this.submitted.set(true);
                this.form().focusBoundControl();
            },
            ignoreValidators: 'pending',
        },
    });
};
UserFormComponent = __decorate([
    Component({
        selector: 'app-user-form',
        imports: [AddressFormComponent, FormRoot],
        providers: [{ provide: SUBMIT_FORM_TOKEN, useClass: forwardRef(() => UserFormComponent) }],
        templateUrl: './user-form.component.html',
    })
], UserFormComponent);
export { UserFormComponent };
//# sourceMappingURL=user-form.component.js.map