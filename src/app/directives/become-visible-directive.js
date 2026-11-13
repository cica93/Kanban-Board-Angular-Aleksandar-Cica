import { __decorate } from "tslib";
import { Directive, ElementRef, effect, inject, input, output } from '@angular/core';
let BecomeVisibleDirective = class BecomeVisibleDirective {
    hostElement = inject(ElementRef);
    patentElement = input();
    rootMargin = input('20px');
    threshold = input(0.1);
    becomeVisible = output();
    observer;
    constructor() {
        effect(() => {
            const root = this.patentElement();
            const rootMargin = this.rootMargin();
            const threshold = this.threshold();
            this.observer?.disconnect();
            this.observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    this.becomeVisible.emit();
                }
            }, {
                root,
                rootMargin,
                threshold,
            });
            this.observer.observe(this.hostElement.nativeElement);
        });
    }
    ngOnDestroy() {
        this.observer?.disconnect();
    }
};
BecomeVisibleDirective = __decorate([
    Directive({
        selector: '[becomeVisible]',
    })
], BecomeVisibleDirective);
export { BecomeVisibleDirective };
//# sourceMappingURL=become-visible-directive.js.map