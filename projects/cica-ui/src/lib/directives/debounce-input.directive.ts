import { Directive, effect, ElementRef, inject, input, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { InputComponent } from '../input/input.component';

@Directive({
  selector: '[cicaDebounceInput]',
})
export class DebounceInputDirective {
  debounceTime = input(300);
  cicaDebounceInput = output<string>();
  private readonly el = inject(ElementRef<HTMLInputElement>, { optional: true });
  private readonly input = inject(InputComponent, { optional: true });
  private readonly debouncedValue = toSignal(
    (this.input
      ? toObservable(this.input.value).pipe(map((value) => String(value ?? '')))
      : fromEvent<InputEvent>(this.el!.nativeElement, 'input').pipe(
          map((event) => (event.target as HTMLInputElement).value),
        )
    ).pipe(debounceTime(this.debounceTime()), distinctUntilChanged()),
    { initialValue: this.input?.value() ?? this.el?.nativeElement.value ?? '' },
  );

  constructor() {
    effect(() => {
      this.cicaDebounceInput.emit(this.debouncedValue() ?? '');
    });
  }
}
