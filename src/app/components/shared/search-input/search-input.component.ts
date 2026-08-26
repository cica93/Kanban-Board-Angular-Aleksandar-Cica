import { Component, effect, ElementRef, input, model, output, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DebounceInputDirective } from 'src/app/directives/debounce-input.directive';

@Component({
  selector: 'app-search-input',
  imports: [
    DebounceInputDirective,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  input = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  autoFocus = input(false);
  placeholder = input('');
  value = model<string | null>('');
  debounceTime = input(300);
  inputChange = output<string>();

  setInputValue(event: string): void {
    this.input().nativeElement.value = event;
    this.value.set(event);
    this.inputChange.emit(event);
  }

  constructor() {
    effect(() => {
      if (this.input()) {
        this.input().nativeElement.value = this.value() ?? '';
      }
    });
  }
}
