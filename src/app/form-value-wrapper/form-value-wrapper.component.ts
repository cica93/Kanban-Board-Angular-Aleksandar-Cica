import { TitleCasePipe } from '@angular/common';
import { Component, computed, contentChild, input, signal } from '@angular/core';
import { MessageWrapperComponent } from '../components/message-wrapper.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-form-value-wrapper',
  imports: [TitleCasePipe, MessageWrapperComponent, ProgressSpinnerModule],
  templateUrl: './form-value-wrapper.component.html',
  host: {
    class: 'flex flex-column gap-1',
    '[class.hidden]': 'hidden()',
    '[class.invalid]': 'invalid()',
    '[class.touched]': 'touched()',
  },
})
export class FormValueWrapperComponent<T> {
  label = input<string>('');
  name = input<string>('');
  control = contentChild<FormField<T>>(FormField<T>);

  errorMessage = computed(() => {
    const errors = this.control()?.errors?.();
    return errors && errors[0] && errors[0].message;
  });
  hidden = computed(() => this.control()?.state()?.hidden() ?? false);
  required = computed(() => this.control()?.state()?.required() ?? false);
  pending = computed(() => this.control()?.state()?.pending() ?? false);
  invalid = computed(() => this.control()?.state().invalid() ?? false);
  touched = computed(() => this.control()?.state().touched?.() ?? false);
}
