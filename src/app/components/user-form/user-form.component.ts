import { Component, output, signal } from '@angular/core';
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
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocus } from 'primeng/autofocus';
import { Button } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { User } from 'src/app/services/user.service';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

export type AddressFormInput = Omit<Address, 'id'>;

@Component({
  selector: 'app-user-form',
  imports: [
    AddressFormComponent,
    FormValueWrapperComponent,
    FormField,
    FormRoot,
    InputTextModule,
    AutoFocus,
    Button,
    RippleModule,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent extends BaseDialogComponent<User> {
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
  userForm = form<{
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
          alert('submit');
          this.formSubmitted.emit(this.userForm().value);
          this.closeModal();
        },
        onInvalid: () => {
          this.userForm().markAsDirty();
          this.userForm().focusBoundControl();
        },
        ignoreValidators: 'pending',
      },
    },
  );
}
