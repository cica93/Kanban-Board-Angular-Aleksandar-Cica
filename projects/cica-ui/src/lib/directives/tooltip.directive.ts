import {
  Directive,
  ElementRef,
  Renderer2,
  OnDestroy,
  input,
  TemplateRef,
  inject,
  ViewContainerRef,
  EmbeddedViewRef,
} from '@angular/core';

@Directive({
  selector: '[cicaTooltip]',
  exportAs: 'cicaTooltip',
  host: {
    '(mouseleave)': 'onMouseLeave()',
    '(mouseenter)': 'onMouseEnter()',
  },
})
export class TooltipDirective implements OnDestroy {
  cicaTooltip = input.required<string | TemplateRef<any>>();
  customTrigger = input<boolean>(false);
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('top');
  tooltipDisabled = input<boolean>(false);

  private tooltipElement: HTMLElement | null = null;
  private tooltipView?: EmbeddedViewRef<any>;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private hideTimeout?: ReturnType<typeof setTimeout>;
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly viewContainerRef = inject(ViewContainerRef);

  onMouseEnter(): void {
    if (!this.customTrigger() && !this.tooltipDisabled()) {
      this.clearTimeouts();
      this.showTimeout = setTimeout(() => {
        this.show();
      }, 100);
    }
  }

  onMouseLeave(): void {
    if (!this.customTrigger() && !this.tooltipDisabled()) {
      this.clearTimeouts();
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, 100);
    }
  }

  show(): void {
    if (!this.cicaTooltip() || this.tooltipElement) {
      return;
    }

    const host = this.elementRef.nativeElement;
    const tooltip = this.renderer.createElement('div') as HTMLElement;
    if (typeof this.cicaTooltip() === 'string') {
      this.renderer.setProperty(tooltip, 'textContent', this.cicaTooltip());
    } else {
      this.renderer.addClass(tooltip, 'app-tooltip-interactive');
      this.tooltipView = this.viewContainerRef.createEmbeddedView(
        this.cicaTooltip() as TemplateRef<any>,
      );
      this.tooltipView.detectChanges();
      for (const rootNode of this.tooltipView.rootNodes) {
        this.renderer.appendChild(tooltip, rootNode);
      }
    }
    const preferredPosition = this.tooltipPosition();
    this.renderer.addClass(tooltip, 'app-tooltip');
    this.renderer.addClass(tooltip, `app-tooltip-${preferredPosition}`);
    this.renderer.appendChild(document.body, tooltip);

    this.tooltipElement = tooltip;

    this.positionTooltip(host, tooltip, preferredPosition);

    requestAnimationFrame(() => {
      this.renderer.addClass(tooltip, 'app-tooltip-visible');
    });
  }

  hide(): void {
    if (!this.tooltipElement) {
      return;
    }

    const tooltip = this.tooltipElement;
    const tooltipView = this.tooltipView;
    this.tooltipView = undefined;

    this.renderer.removeClass(tooltip, 'app-tooltip-visible');

    setTimeout(() => {
      this.renderer.removeChild(document.body, tooltip);
      tooltipView?.destroy();
    }, 100);

    this.tooltipElement = null;
  }

  private positionTooltip(
    host: HTMLElement,
    tooltip: HTMLElement,
    preferredPosition: 'top' | 'bottom' | 'left' | 'right',
  ): void {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const hostRect = host.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 8;
    const edge = 8;
    const position = calculatePreferredPosition(
      host,
      tooltip,
      preferredPosition,
      viewportHeight,
      viewportWidth,
    );
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

type PreferredPosition = 'top' | 'bottom' | 'left' | 'right';
type PreferredPositionConfig = Record<PreferredPosition, boolean>;

export function calculatePreferredPosition(
  host: HTMLElement,
  child: HTMLElement,
  preferredPosition: PreferredPosition,
  viewportHeight: number,
  viewportWidth: number,
  edge = 8,
  gap = 8,
): PreferredPosition {
  const fits = calculateFits(
    host.getBoundingClientRect(),
    child.getBoundingClientRect(),
    viewportHeight,
    viewportWidth,
    edge,
    gap,
  );

  return fits[preferredPosition]
    ? preferredPosition
    : fits[OpositePosition[preferredPosition]]
      ? OpositePosition[preferredPosition]
      : ((Object.keys(fits) as Array<keyof typeof fits>).find((side) => fits[side]) ??
        preferredPosition);
}

export function calculateFits(
  hostRect: DOMRect,
  childRect: DOMRect,
  viewportHeight: number,
  viewportWidth: number,
  edge = 4,
  gap = 4,
): PreferredPositionConfig {
  return {
    top: hostRect.top >= childRect.height + gap + edge,
    bottom: viewportHeight - hostRect.bottom >= childRect.height + gap + edge,
    left: hostRect.left >= childRect.width + gap + edge,
    right: viewportWidth - hostRect.right >= childRect.width + gap + edge,
  };
}

export const OpositePosition = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
} as const;
