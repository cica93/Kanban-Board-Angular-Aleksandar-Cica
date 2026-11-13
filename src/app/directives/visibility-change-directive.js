import { __decorate } from "tslib";
import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
let VisiblilityChangeDirective = class VisiblilityChangeDirective {
    hostElement = inject((ElementRef));
    patentElement = input();
    rootMargin = input('20px');
    threshold = input(0.1);
    appVisiblilityChange = output();
    observer;
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
                callBackFunction: (isIntersecting) => {
                    this.appVisiblilityChange.emit(isIntersecting);
                },
                observerElement: this.hostElement.nativeElement,
            });
        });
    }
    ngOnDestroy() {
        this.observer?.unobserve(this.hostElement.nativeElement);
    }
};
VisiblilityChangeDirective = __decorate([
    Directive({
        selector: '[appVisiblilityChange]',
    })
], VisiblilityChangeDirective);
export { VisiblilityChangeDirective };
export function subscribeOnElementAppear(config) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0]) {
            config.callBackFunction(entries[0].isIntersecting);
        }
    }, {
        root: config.root,
        rootMargin: config.rootMargin ?? '200px',
        threshold: config.threshold ?? 0.1,
    });
    observer.observe(config.observerElement);
    return observer;
}
//# sourceMappingURL=visibility-change-directive.js.map