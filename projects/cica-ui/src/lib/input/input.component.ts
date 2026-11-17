import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  imports: [],
  selector: 'cica-input',
  styleUrl: './input.component.scss',
  templateUrl: './input.component.html',
  host: {
    '[class.hidden]': 'hidden()',
  },
})
export class InputComponent implements FormValueControl<string | number | boolean | null> {
  label = input<string | undefined>();
  placeholder = input<string | undefined>();
  errorMessage = input<string | undefined>();
  labelPosition = input<'top' | 'left'>('top');
  value = model<string | number | boolean | null>(null);
  disabled = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  showClearIcon = input<boolean>(false);
  showTogglePassword = input<boolean>(true);
  required = input<boolean>(false);
  inputType = input<'text' | 'number' | 'password' | 'checkbox'>('text');

  labelClick(target: EventTarget | null): void {
    if (target) {
      (target as HTMLElement).parentElement?.querySelector('input')?.focus();
    }
  }

  clear(): void {
    this.value.set('');
  }

  togglePassword(target: EventTarget | null): void {
    if (!target) {
      return;
    }
    const element = target as HTMLElement;
    const input = element.closest('.input-wrapper')?.querySelector('input') as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
    element.querySelectorAll<SVGElement>('svg').forEach((e) => e.classList.toggle('d-none'));
  }
}
