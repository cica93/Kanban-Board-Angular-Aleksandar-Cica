import { Component, input, model, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebounceInputDirective } from 'src/app/directives/debounce-input.directive';
import { IonIcon, IonInput, IonItem, IonList } from '@ionic/angular';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-search-input',
  imports: [
    DebounceInputDirective,
    FormsModule,
    IonInput,
    IonItem,
    IonList,
    IonIcon,
  ],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  searchIcon = search;
  input = viewChild.required<IonInput>('searchInput');
  autoFocus = input(false);
  placeholder = input('');
  value = model<string | null>('');
  debounceTime = input(300);
  inputChange = output<string>();

  setInputValue(event: string): void {
    this.writeValue(event);
    this.value.set(event);
    this.inputChange.emit(event);
  }

  private writeValue(event: string): void {
    this.input().writeValue(event);
  }
}
