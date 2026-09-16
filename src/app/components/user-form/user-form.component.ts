import { Component, forwardRef, input, output, signal } from '@angular/core';
import {
  Address,
  AddressFormComponent,
  addressSchema,
} from '../address-form/address-form.component';
import { apply, form, FormRoot, minLength, required } from '@angular/forms/signals';
import { SUBMIT_FORM_TOKEN, SubmitForm } from '../shared/base-dialog/base-dialog.component';
import { Subject } from 'rxjs';

export type AddressFormInput = Omit<Address, 'id'>;

export interface AddressForm {
  name: string;
  address: AddressFormInput;
  billingAddress: AddressFormInput;
}

@Component({
  selector: 'app-user-form',
  imports: [AddressFormComponent, FormRoot],
  providers: [{ provide: SUBMIT_FORM_TOKEN, useClass: forwardRef(() => UserFormComponent) }],
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
