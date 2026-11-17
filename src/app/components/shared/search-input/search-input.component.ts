import { Component, effect, input, model, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebounceInputDirective } from 'cica-ui';
import { search } from 'ionicons/icons';
import { InputComponent } from 'cica-ui';

@Component({
  selector: 'app-search-input',
  imports: [DebounceInputDirective, FormsModule, InputComponent],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  searchIcon = search;
  input = viewChild.required<InputComponent>('searchInput');
  autoFocus = input(false);
  placeholder = input('');
  value = model<string | null>('');
  debounceTime = input(300);
  inputChange = output<string>();

  constructor() {
    effect(() => {
      const value = this.value();

      this.setInputValue(value ?? '', false);
    });
  }

  setInputValue(event: string, emitChanges = true): void {
    this.writeValue(event);
    this.value.set(event);
    if (emitChanges) {
      this.inputChange.emit(event);
    }
  }

  private writeValue(event: string): void {
    this.input().value.set(event);
  }
}
