import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[appDebounceInput]',
})
export class DebounceInputDirective implements OnInit {
  @Input() debounceTime = 300;
  appDebounceInput = output<string>();
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    fromEvent<InputEvent>(this.el.nativeElement, 'input')
      .pipe(
        map((e) => (e.target as HTMLInputElement).value),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.appDebounceInput.emit(e);
      });
  }
}
