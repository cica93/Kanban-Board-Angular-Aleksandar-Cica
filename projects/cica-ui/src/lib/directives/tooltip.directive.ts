import { Directive, ElementRef, Renderer2, OnDestroy, input } from '@angular/core';

@Directive({
  selector: '[cicaTooltip]',
  host: {
    '(mouseleave)': 'onMouseLeave()',
    '(mouseenter)': 'onMouseEnter()',
  },
})
export class TooltipDirective implements OnDestroy {
  cicaTooltip = input.required<string>();
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private tooltipElement?: HTMLElement;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private hideTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}
 

  onMouseEnter(): void {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      this.show();
    }, 100);
  }

  onMouseLeave(): void {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 50);
  }

  private show(): void {
    if (!this.cicaTooltip() || this.tooltipElement) {
      return;
    }

    const host = this.elementRef.nativeElement;

    const tooltip = this.renderer.createElement('div') as HTMLElement;
    const preferredPosition = this.tooltipPosition();

    this.renderer.addClass(tooltip, 'app-tooltip');
    this.renderer.addClass(tooltip, `app-tooltip-${preferredPosition}`);

    this.renderer.setProperty(tooltip, 'textContent', this.cicaTooltip());

    this.renderer.appendChild(document.body, tooltip);

    this.tooltipElement = tooltip;

    this.positionTooltip(host, tooltip, preferredPosition);

    requestAnimationFrame(() => {
      this.renderer.addClass(tooltip, 'app-tooltip-visible');
    });
  }

  private hide(): void {
    if (!this.tooltipElement) {
      return;
    }

    const tooltip = this.tooltipElement;

    this.renderer.removeClass(tooltip, 'app-tooltip-visible');

    setTimeout(() => {
      if (tooltip.parentNode) {
        this.renderer.removeChild(document.body, tooltip);
      }
    }, 100);

    this.tooltipElement = undefined;
  }

  private positionTooltip(
    host: HTMLElement,
    tooltip: HTMLElement,
    preferredPosition: 'top' | 'bottom' | 'left' | 'right',
  ): void {
    const hostRect = host.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 8;
    const edge = 8;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const fits = {
      top: hostRect.top >= tooltipRect.height + gap + edge,
      bottom: viewportHeight - hostRect.bottom >= tooltipRect.height + gap + edge,
      left: hostRect.left >= tooltipRect.width + gap + edge,
      right: viewportWidth - hostRect.right >= tooltipRect.width + gap + edge,
    };
    const opposite = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    } as const;
    const position = fits[preferredPosition]
      ? preferredPosition
      : fits[opposite[preferredPosition]]
        ? opposite[preferredPosition]
        : ((Object.keys(fits) as Array<keyof typeof fits>).find((side) => fits[side]) ??
          preferredPosition);

    this.renderer.removeClass(tooltip, `app-tooltip-${preferredPosition}`);
    this.renderer.addClass(tooltip, `app-tooltip-${position}`);

    let top: number;
    let left: number;

    switch (position) {
      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
      default:
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
    }

    top = Math.max(edge, Math.min(top, viewportHeight - tooltipRect.height - edge));
    left = Math.max(edge, Math.min(left, viewportWidth - tooltipRect.width - edge));

    this.renderer.setStyle(tooltip, 'top', `${top}px`);
    this.renderer.setStyle(tooltip, 'left', `${left}px`);
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
    this.hide();
  }
}
