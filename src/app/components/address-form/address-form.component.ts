import { Component, effect, input } from '@angular/core';
import { FieldTree, FormField, required, schema } from '@angular/forms/signals';
import { FirstFocusDirective } from '@directives/first-focus.directive';
import { IonInput, IonList, IonItem } from '@ionic/angular';

export interface Address {
  id: number;
  street: string;
  city: string;
  zipCode: string;
}

@Component({
  selector: 'app-address-form',
  imports: [FirstFocusDirective, FormField, IonInput, IonList, IonItem],
  templateUrl: './address-form.component.html',
})
export class AddressFormComponent {
  addressFields = input.required<FieldTree<Omit<Address, 'id'>>>();

  submitted = input(false);

  constructor() {
    effect(() => {
      if (this.submitted()) {
        this.markFieldsDirty();
      }
    });
  }

  private markFieldsDirty() {
    const fields = this.addressFields();
    fields.street().markAsDirty();
    fields.city().markAsDirty();
    fields.zipCode().markAsDirty();
  }
}

export function addressSchema() {
  return schema<Omit<Address, 'id'>>((path) => {
    required(path.street, { message: 'Street is required' });
    required(path.city, { message: 'City is required' });
    required(path.zipCode, { message: 'ZIP code is required' });
  });
}
