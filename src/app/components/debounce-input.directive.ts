import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subscription } from 'rxjs';

@Directive({
  selector: '[appDebounceInput]',
  standalone: true,
})
export class DebounceInputDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 300;
  @Output() appDebounceInput = new EventEmitter<string>();
  constructor(private el: ElementRef<HTMLInputElement>) {}
  subscription: Subscription | undefined;

  ngOnInit(): void {
    fromEvent(this.el.nativeElement, 'input')
      .pipe(
        map((e) => (e.target as HTMLInputElement).value),
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe((e: string | null) => {
        this.appDebounceInput.emit(e ?? '');
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
