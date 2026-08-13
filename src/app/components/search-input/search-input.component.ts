import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { AutoFocus } from 'primeng/autofocus';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DebounceInputDirective } from 'src/app/directives/debounce-input.directive';

@Component({
  selector: 'app-search-input',
  imports: [
    InputTextModule,
    InputIcon,
    IconField,
    AutoFocus,
    DebounceInputDirective,
  ],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  input = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  autoFocus = input(false);
  placeholder = input('');
  debounceTime = input(300);
  inputChange = output<string>();

  setInputValue(event: string): void {
    this.input().nativeElement.value = event;
    this.inputChange.emit(event);
  }
}
