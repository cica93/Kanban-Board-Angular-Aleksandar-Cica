import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input({ required: true }) appTooltip!: string;
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipElement?: HTMLElement;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private hideTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      this.show();
    }, 100);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.clearTimeouts();

    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 50);
  }

  private show(): void {
    if (!this.appTooltip || this.tooltipElement) {
      return;
    }

    const host = this.elementRef.nativeElement;

    const tooltip = this.renderer.createElement('div');

    this.renderer.addClass(tooltip, 'app-tooltip');
    this.renderer.addClass(tooltip, `app-tooltip-${this.tooltipPosition}`);

    this.renderer.setProperty(tooltip, 'textContent', this.appTooltip);

    this.renderer.appendChild(document.body, tooltip);

    this.tooltipElement = tooltip;

    this.positionTooltip(host, tooltip);

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

  private positionTooltip(host: HTMLElement, tooltip: HTMLElement): void {
    const hostRect = host.getBoundingClientRect();

    const tooltipRect = tooltip.getBoundingClientRect();

    const gap = 8;

    let top: number;
    let left: number;

    switch (this.tooltipPosition) {
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
