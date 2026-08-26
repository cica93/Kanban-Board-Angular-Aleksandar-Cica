import { Component, forwardRef, input, output, signal } from '@angular/core';
import {
  Address,
  AddressFormComponent,
  addressSchema,
} from '../address-form/address-form.component';
import {
  apply,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';
import {
  FORM_TOKEN,
  SubmitForm,
} from '../shared/base-dialog/base-dialog.component';
import { Subject } from 'rxjs';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatRipple } from '@angular/material/core';
import { FirstFocusDirective } from 'src/app/directives/first-focus.directive';

export type AddressFormInput = Omit<Address, 'id'>;

export interface AddressForm {
  name: string;
  address: AddressFormInput;
  billingAddress: AddressFormInput;
}

@Component({
  selector: 'app-user-form',
  imports: [
    AddressFormComponent,
    FormField,
    FormRoot,
    FirstFocusDirective,
    MatFormField,
    MatLabel,
    MatRipple,
  ],
  providers: [
    { provide: FORM_TOKEN, useClass: forwardRef(() => UserFormComponent) },
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements SubmitForm<AddressForm, AddressForm> {
  initValue = input<AddressForm | null | undefined>(null);
  onClose: Subject<boolean> = new Subject();
  formSubmitted = output<any>();
  userModel = signal<{
    name: string;
    address: AddressFormInput;
    billingAddress: AddressFormInput;
  }>({
    name: '',
    address: { street: '', city: '', zipCode: '' } as AddressFormInput,
    billingAddress: { street: '', city: '', zipCode: '' } as AddressFormInput,
  });
  form = form<{
    name: string;
    address: AddressFormInput;
    billingAddress: AddressFormInput;
  }>(
    this.userModel,
    (path) => {
      required(path.name, { message: 'name is required' });
      minLength(path.name, 3, {
        message: 'name should have the least 3 characters',
      });
      apply(path.address, addressSchema());
      apply(path.billingAddress, addressSchema());
    },
    {
      submission: {
        action: async () => {
          this.formSubmitted.emit(this.form().value);
          //this.closeModal();
        },
        onInvalid: () => {
          this.form().markAsDirty();
          this.form().focusBoundControl();
        },
        ignoreValidators: 'pending',
      },
    },
  );
}
