import { __decorate } from "tslib";
import { Component, input, signal } from '@angular/core';
let ScrollTopComponent = class ScrollTopComponent {
    threshold = input(400);
    visible = signal(false);
    onWindowScroll() {
        this.visible.set(window.scrollY > this.threshold());
    }
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
};
ScrollTopComponent = __decorate([
    Component({
        selector: 'app-scroll-top',
        templateUrl: './scroll-top.component.html',
        styleUrl: './scroll-top.component.scss',
        host: {
            '(window:scroll)': 'onWindowScroll()',
        },
    })
], ScrollTopComponent);
export { ScrollTopComponent };
//# sourceMappingURL=scroll-top.component.js.map