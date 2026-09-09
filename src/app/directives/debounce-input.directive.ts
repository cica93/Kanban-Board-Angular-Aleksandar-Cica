import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { outputToObservable, toSignal } from '@angular/core/rxjs-interop';
import { IonInput } from '@ionic/angular';
import { InputInputEventDetail } from '@ionic/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[appDebounceInput]',
})
export class DebounceInputDirective {
  debounceTime = input(300);
  appDebounceInput = output<string>();
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly ionInput = inject(IonInput, { optional: true });

  private readonly debouncedValue = toSignal(
    (!this.ionInput
      ? fromEvent<InputEvent>(this.el.nativeElement, 'input').pipe(
          map((e) => (e.target as HTMLInputElement).value),
        )
      : outputToObservable<CustomEvent<InputInputEventDetail>>(
          this.ionInput.ionInput,
        ).pipe(map((e) => e.detail.value))
    ).pipe(debounceTime(this.debounceTime()), distinctUntilChanged()),
    { initialValue: this.el.nativeElement.value ?? '' },
  );

  constructor() {
    effect(() => {
      this.appDebounceInput.emit(this.debouncedValue() ?? '');
    });
  }
}
