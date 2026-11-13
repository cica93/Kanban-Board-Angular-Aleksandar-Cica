import { __decorate } from "tslib";
import { Component, input, output, signal } from '@angular/core';
import { IonAvatar } from '@ionic/angular';
import { SlicePipe } from '@angular/common';
import { SidebarLinkComponent, SidebarLinkTemplateDirective, SidebarWrapperComponent, } from 'cica-ui';
let SidebarComponent = class SidebarComponent {
    observer;
    sidebarSize = signal('sm');
    sidebarTheme = signal('dark');
    sidebarPosition = signal('top');
    ngOnInit() {
        const sidebarSize = 'data-sidebar-size';
        const sidebarPosition = 'data-sidebar-position';
        const sidebarTheme = 'data-sidebar-theme';
        const html = this.getHtmlElement();
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === sidebarSize) {
                    this.sidebarSize.set(this.getAttribute(mutation, sidebarSize) ?? 'sm');
                }
                else if (mutation.attributeName === sidebarPosition) {
                    this.sidebarPosition.set(this.getAttribute(mutation, sidebarPosition) ?? 'left');
                }
                else {
                    this.sidebarTheme.set(this.getAttribute(mutation, sidebarTheme) ?? 'dark');
                }
            });
        });
        this.observer.observe(html, {
            attributes: true,
            attributeFilter: [sidebarSize, sidebarPosition, sidebarTheme],
        });
    }
    user = input.required();
    logout = output();
    toggleMenu() {
        const sidebarSizeAttribute = 'data-sidebar-size';
        const html = document.getElementsByTagName('html')[0];
        if (html.getAttribute(sidebarSizeAttribute) === 'lg') {
            html.setAttribute(sidebarSizeAttribute, 'sm');
        }
        else {
            html.setAttribute(sidebarSizeAttribute, 'lg');
        }
    }
    getHtmlElement() {
        return document.getElementsByTagName('html')[0];
    }
    getAttribute(mutation, attrinuteName) {
        return mutation.target.getAttribute(attrinuteName);
    }
};
SidebarComponent = __decorate([
    Component({
        imports: [
            SidebarLinkComponent,
            SidebarWrapperComponent,
            IonAvatar,
            SlicePipe,
            SidebarLinkTemplateDirective,
        ],
        selector: 'app-sidebar',
        styleUrl: './sidebar.component.scss',
        templateUrl: './sidebar.component.html',
    })
], SidebarComponent);
export { SidebarComponent };
//# sourceMappingURL=sidebar.component.js.map