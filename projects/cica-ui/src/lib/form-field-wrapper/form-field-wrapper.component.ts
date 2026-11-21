import { Component, computed, contentChild, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  imports: [],
  selector: 'cica-form-field-wrapper',
  styleUrl: './form-field-wrapper.component.scss',
  templateUrl: './form-field-wrapper.component.html',
  host: {
    '[class.hidden]': 'hidden()',
    '[class.disabled]': 'disabled()',
  },
})
export class FormFieldWrapperComponent<T> {
  control = contentChild<FormField<T>>(FormField<T>);

  label = input<string>('');

  errorMessage = computed(() => {
    const errors = this.control()?.errors?.();
    return errors && errors[0] && errors[0].message;
  });
  hidden = computed(() => this.control()?.state()?.hidden() ?? false);
  required = computed(() => this.control()?.state()?.required() ?? false);
  pending = computed(() => this.control()?.state()?.pending() ?? false);
  invalid = computed(() => this.control()?.state().invalid() ?? false);
  touched = computed(() => this.control()?.state().touched?.() ?? false);
  disabled = computed(() => this.control()?.state().disabled?.() ?? false);
}
