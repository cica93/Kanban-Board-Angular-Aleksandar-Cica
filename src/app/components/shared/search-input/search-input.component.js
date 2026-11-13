import { __decorate } from "tslib";
import { Component, effect, input, model, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebounceInputDirective } from '@directives/debounce-input.directive';
import { IonIcon, IonInput, IonItem, IonList } from '@ionic/angular';
import { search } from 'ionicons/icons';
let SearchInputComponent = class SearchInputComponent {
    searchIcon = search;
    input = viewChild.required('searchInput');
    autoFocus = input(false);
    placeholder = input('');
    value = model('');
    debounceTime = input(300);
    inputChange = output();
    constructor() {
        effect(() => {
            const value = this.value();
            this.setInputValue(value ?? '', false);
        });
    }
    setInputValue(event, emitChanges = true) {
        this.writeValue(event);
        this.value.set(event);
        if (emitChanges) {
            this.inputChange.emit(event);
        }
    }
    writeValue(event) {
        this.input().writeValue(event);
    }
};
SearchInputComponent = __decorate([
    Component({
        selector: 'app-search-input',
        imports: [DebounceInputDirective, FormsModule, IonInput, IonItem, IonList, IonIcon],
        templateUrl: './search-input.component.html',
    })
], SearchInputComponent);
export { SearchInputComponent };
//# sourceMappingURL=search-input.component.js.map