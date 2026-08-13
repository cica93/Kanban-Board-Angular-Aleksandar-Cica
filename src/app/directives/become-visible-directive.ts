import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';


export type Measure = 'px' | 'rem' | 'vh' | 'vw' | '%';
export type CssSize =`${number}${Measure}`

@Directive({
  selector: '[becomeVisible]',
  standalone: true,
})
export class BecomeVisibleDirective implements OnDestroy {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>,
  );
  patentElement = input<HTMLElement>();
  rootMargin = input<CssSize>('20px');
  threshold = input<number>(0.1);

  becomeVisible = output<void>();
  observer?: IntersectionObserver;

  constructor() {
    combineLatest([
      toObservable(this.rootMargin),
      toObservable(this.threshold),
      toObservable(this.patentElement),
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([rootMargin, threshold, root]) => {
        this.observer = subscribeOnElementAppear({
          rootMargin,
          threshold,
          root,
          callBackFunction: () => {
            this.becomeVisible.emit();
          },
          observerElement: this.hostElement.nativeElement,
        });
      });
  }

  ngOnDestroy(): void {
    this.observer?.unobserve(this.hostElement.nativeElement);
  }
}

export function subscribeOnElementAppear(config: {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
  observerElement: Element;
  callBackFunction: () => void;
}): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {

        config.callBackFunction();
      }
    },
    {
      root: config.root,
      rootMargin: config.rootMargin ?? '200px',
      threshold: config.threshold ?? 0.1,
    },
  );
  observer.observe(config.observerElement);
  return observer;
}
