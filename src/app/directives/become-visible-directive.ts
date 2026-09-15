import { Directive, ElementRef, effect, inject, input, output } from '@angular/core';

export type Measure = 'px' | 'rem' | 'vh' | 'vw' | '%';
export type CssSize = `${number}${Measure}`;

@Directive({
  selector: '[becomeVisible]',
})
export class BecomeVisibleDirective {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  patentElement = input<HTMLElement>();
  rootMargin = input<CssSize>('20px');
  threshold = input<number>(0.1);

  becomeVisible = output<void>();

  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const root = this.patentElement();
      const rootMargin = this.rootMargin();
      const threshold = this.threshold();

      this.observer?.disconnect();

      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.becomeVisible.emit();
          }
        },
        {
          root,
          rootMargin,
          threshold,
        },
      );

      this.observer.observe(this.hostElement.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
