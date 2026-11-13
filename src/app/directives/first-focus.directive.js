import { __decorate } from "tslib";
import { Directive, ElementRef, inject, input } from '@angular/core';
let FirstFocusDirective = class FirstFocusDirective {
    hostElement = inject(ElementRef);
    appFirstFocus = input(false);
    ngOnInit() {
        if (this.appFirstFocus()) {
            this.hostElement.nativeElement.focus();
        }
    }
};
FirstFocusDirective = __decorate([
    Directive({
        selector: '[appFirstFocus]',
    })
], FirstFocusDirective);
export { FirstFocusDirective };
//# sourceMappingURL=first-focus.directive.js.map