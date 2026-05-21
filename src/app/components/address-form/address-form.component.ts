import { Component, input } from '@angular/core';
import { FieldTree, FormField, required, schema } from '@angular/forms/signals';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputTextModule } from 'primeng/inputtext';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';

export interface Address {
  id: number
  street: string;
  city: string;
  zipCode: string;
}

@Component({
  selector: 'app-address-form',
  imports: [
    FormValueWrapperComponent,
    FormField,
    InputTextModule,
    AutoFocusModule
  ],
  templateUrl: './address-form.component.html',
})
export class AddressFormComponent {
  addressFields = input.required<FieldTree<Omit<Address, 'id'>>>();
}

export function addressSchema() {
  return schema<Omit<Address, 'id'>>((path) => {
    required(path.street);
    required(path.city);
    required(path.zipCode);
  });
}
