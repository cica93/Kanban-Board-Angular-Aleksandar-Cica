import { __decorate } from "tslib";
import { Component, effect, input } from '@angular/core';
import { FormField, required, schema } from '@angular/forms/signals';
import { FirstFocusDirective } from '@directives/first-focus.directive';
import { IonInput, IonList, IonItem } from '@ionic/angular';
let AddressFormComponent = class AddressFormComponent {
    addressFields = input.required();
    submitted = input(false);
    constructor() {
        effect(() => {
            if (this.submitted()) {
                this.markFieldsDirty();
            }
        });
    }
    markFieldsDirty() {
        const fields = this.addressFields();
        fields.street().markAsDirty();
        fields.city().markAsDirty();
        fields.zipCode().markAsDirty();
    }
};
AddressFormComponent = __decorate([
    Component({
        selector: 'app-address-form',
        imports: [FirstFocusDirective, FormField, IonInput, IonList, IonItem],
        templateUrl: './address-form.component.html',
    })
], AddressFormComponent);
export { AddressFormComponent };
export function addressSchema() {
    return schema((path) => {
        required(path.street, { message: 'Street is required' });
        required(path.city, { message: 'City is required' });
        required(path.zipCode, { message: 'ZIP code is required' });
    });
}
//# sourceMappingURL=address-form.component.js.map