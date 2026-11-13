import { __decorate } from "tslib";
import { Directive, HostListener, Input } from '@angular/core';
let TooltipDirective = class TooltipDirective {
    elementRef;
    renderer;
    appTooltip;
    tooltipPosition = 'top';
    tooltipElement;
    showTimeout;
    hideTimeout;
    constructor(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    onMouseEnter() {
        this.clearTimeouts();
        this.showTimeout = setTimeout(() => {
            this.show();
        }, 100);
    }
    onMouseLeave() {
        this.clearTimeouts();
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 50);
    }
    show() {
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
    hide() {
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
    positionTooltip(host, tooltip) {
        const hostRect = host.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 8;
        let top;
        let left;
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
    clearTimeouts() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
    }
    ngOnDestroy() {
        this.clearTimeouts();
        this.hide();
    }
};
__decorate([
    Input({ required: true })
], TooltipDirective.prototype, "appTooltip", void 0);
__decorate([
    Input()
], TooltipDirective.prototype, "tooltipPosition", void 0);
__decorate([
    HostListener('mouseenter')
], TooltipDirective.prototype, "onMouseEnter", null);
__decorate([
    HostListener('mouseleave')
], TooltipDirective.prototype, "onMouseLeave", null);
TooltipDirective = __decorate([
    Directive({
        selector: '[appTooltip]',
        standalone: true,
    })
], TooltipDirective);
export { TooltipDirective };
//# sourceMappingURL=tooltip.directive.js.map