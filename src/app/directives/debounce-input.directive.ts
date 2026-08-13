import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[appDebounceInput]',
})
export class DebounceInputDirective {
  debounceTime = input(300);
  appDebounceInput = output<string>();
  private readonly el = inject(ElementRef<HTMLInputElement>);

  private readonly debouncedValue = toSignal(
    fromEvent<InputEvent>(this.el.nativeElement, 'input').pipe(
      map((e) => (e.target as HTMLInputElement).value),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: this.el.nativeElement.value },
  );

  constructor() {
    effect(() => {
      this.appDebounceInput.emit(this.debouncedValue());
    });
  }
}
