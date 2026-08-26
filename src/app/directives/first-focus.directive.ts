import {
  Directive,
  ElementRef,
  OnInit,
  inject,
  input,
} from '@angular/core';

export type Measure = 'px' | 'rem' | 'vh' | 'vw' | '%';
export type CssSize = `${number}${Measure}`;

@Directive({
  selector: '[appFirstFocus]',
})
export class FirstFocusDirective implements OnInit  {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  appFirstFocus = input<boolean>(false);

  ngOnInit(): void {
    if (this.appFirstFocus()) {
      this.hostElement.nativeElement.focus();
    }
  }
}
