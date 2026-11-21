import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  imports: [],
  selector: 'cica-input',
  styleUrl: './input.component.scss',
  templateUrl: './input.component.html',
})
export class InputComponent implements FormValueControl<string | number | boolean | null> {
  label = input<string | undefined>();
  placeholder = input<string | undefined>();
  value = model<string | number | boolean | null>(null);
  disabled = input<boolean>(false);
  invalid = input<boolean>(false);
  touched = input<boolean>(false);
  showClearIcon = input<boolean>(false);
  showTogglePassword = input<boolean>(true);
  inputType = input<'text' | 'number' | 'password' | 'checkbox' | 'textarea'>('text');

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

  changeTextarea(target: EventTarget | null) {
    if (target) {
      this.value.set((target as HTMLTextAreaElement).value);
    }
  }
}
