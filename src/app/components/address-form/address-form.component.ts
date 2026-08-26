import { Component, input } from '@angular/core';
import { FieldTree, FormField, required, schema } from '@angular/forms/signals';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { FirstFocusDirective } from 'src/app/directives/first-focus.directive';

export interface Address {
  id: number
  street: string;
  city: string;
  zipCode: string;
}

@Component({
  selector: 'app-address-form',
  imports: [
    FirstFocusDirective,
    FormField,
    MatInput,
    MatFormField,
    MatError,
    MatLabel,
  ],
  templateUrl: './address-form.component.html',
})
export class AddressFormComponent {
  addressFields = input.required<FieldTree<Omit<Address, 'id'>>>();
}

export function addressSchema() {
  return schema<Omit<Address, 'id'>>((path) => {
    required(path.street, { message: 'Street is required' });
    required(path.city, { message: 'City is required' });
    required(path.zipCode, { message: 'ZIP code is required' });
  });
}
