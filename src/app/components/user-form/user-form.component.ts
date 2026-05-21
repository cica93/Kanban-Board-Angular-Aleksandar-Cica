import { Component, signal } from '@angular/core';
import { Address, AddressFormComponent, addressSchema } from '../address-form/address-form.component';
import { apply, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocus } from 'primeng/autofocus';
import { Button } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

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
export class UserFormComponent {
  userModel = signal<{
    name: string;
    address: Omit<Address, 'id'>;
    billingAddress: Omit<Address, 'id'>;
  }>({
    name: '',
    address: { street: '', city: '', zipCode: '' } as Omit<Address, 'id'>,
    billingAddress: { street: '', city: '', zipCode: '' } as Omit<
      Address,
      'id'
    >,
  });
  userForm = form<{
    name: string;
    address: Omit<Address, 'id'>;
    billingAddress: Omit<Address, 'id'>;
  }>(
    this.userModel,
    (path) => {
      required(path.name);
      apply(path.address, addressSchema());
      apply(path.billingAddress, addressSchema());
    },
    {
      submission: {
        action: async () => {},
        onInvalid: () => {
          this.userForm().markAsDirty();
          this.userForm().focusBoundControl();
        },
      },
    },
  );

  close(): void {}
}
