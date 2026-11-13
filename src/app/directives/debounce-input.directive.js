import { __decorate } from "tslib";
import { Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { outputToObservable, toSignal } from '@angular/core/rxjs-interop';
import { IonInput } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
let DebounceInputDirective = class DebounceInputDirective {
    debounceTime = input(300);
    appDebounceInput = output();
    el = inject((ElementRef));
    ionInput = inject(IonInput, { optional: true });
    debouncedValue = toSignal((!this.ionInput
        ? fromEvent(this.el.nativeElement, 'input').pipe(map((e) => e.target.value))
        : outputToObservable(this.ionInput.ionInput).pipe(map((e) => e.detail.value))).pipe(debounceTime(this.debounceTime()), distinctUntilChanged()), { initialValue: this.el.nativeElement.value ?? '' });
    constructor() {
        effect(() => {
            this.appDebounceInput.emit(this.debouncedValue() ?? '');
        });
    }
};
DebounceInputDirective = __decorate([
    Directive({
        selector: '[appDebounceInput]',
    })
], DebounceInputDirective);
export { DebounceInputDirective };
//# sourceMappingURL=debounce-input.directive.js.map