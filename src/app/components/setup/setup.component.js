import { __decorate } from "tslib";
import { Component } from '@angular/core';
let SetupComponent = class SetupComponent {
    observer;
    ngOnInit() {
        const sidebarSize = 'data-sidebar-size';
        const html = this.getHtmlElement();
        document.querySelector('#size-' + html.getAttribute(sidebarSize)).checked =
            true;
        document.querySelector('#position-' + html.getAttribute('data-sidebar-position')).checked = true;
        document.querySelector('#theme-' + html.getAttribute('data-sidebar-theme')).checked = true;
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === sidebarSize) {
                    const newValue = this.getAttribute(mutation, sidebarSize);
                    document.querySelector('#size-' + newValue).checked = true;
                }
            });
        });
        this.observer.observe(html, {
            attributes: true,
            attributeFilter: [sidebarSize],
        });
    }
    getAttribute(mutation, attrinuteName) {
        return mutation.target.getAttribute(attrinuteName);
    }
    ngOnDestroy() {
        this.observer?.disconnect();
    }
    setHtmlProperty(proerty, value) {
        this.getHtmlElement().setAttribute('data-sidebar-' + proerty, value);
    }
    getHtmlElement() {
        return document.getElementsByTagName('html')[0];
    }
};
SetupComponent = __decorate([
    Component({
        imports: [],
        selector: 'app-setup',
        styleUrl: './setup.component.scss',
        templateUrl: './setup.component.html',
    })
], SetupComponent);
export { SetupComponent };
//# sourceMappingURL=setup.component.js.map