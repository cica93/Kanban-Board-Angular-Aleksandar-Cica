import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[cicaClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  cicaClickOutside = output<MouseEvent>();
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.cicaClickOutside.emit(event);
    }
  }
}
