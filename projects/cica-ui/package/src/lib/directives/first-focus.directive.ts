import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

@Directive({
  selector: '[cicaFirstFocus]',
})
export class FirstFocusDirective implements OnInit {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  cicaFirstFocus = input<boolean>(false);

  ngOnInit(): void {
    if (this.cicaFirstFocus()) {
      this.hostElement.nativeElement.focus();
    }
  }
}
