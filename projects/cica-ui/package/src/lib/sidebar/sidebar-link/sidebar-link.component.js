import { __decorate } from "tslib";
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, contentChildren, inject, input, output, viewChildren, } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, map, merge, scan, startWith, Subject, switchMap } from 'rxjs';
import { SidebarLinkTemplateDirective } from './sidebar-link-template.directive';
let SidebarLinkComponent = class SidebarLinkComponent {
    url = input();
    icon = input();
    label = input();
    linkClick = output();
    links$ = viewChildren(RouterLinkActive);
    labelTemplate = contentChild('labelTemplate');
    linkTemplates = contentChildren(SidebarLinkTemplateDirective);
    router = inject(Router);
    toggle = new Subject();
    isOpen$ = merge(toObservable(this.links$).pipe(switchMap((links) => combineLatest(links.map((e) => e.isActiveChange.asObservable().pipe(startWith(false)))).pipe(map((isActiveAnyLink) => ({
        event: 'navigate',
        value: isActiveAnyLink.some(Boolean),
    }))))), this.toggle.asObservable()).pipe(scan((acc, cur) => {
        if (cur.event === 'click') {
            return !acc;
        }
        return cur?.value ?? false;
    }, false));
    linkClicked() {
        if (this.url()) {
            this.router.navigate([this.url()]);
        }
        this.linkClick.emit();
    }
};
SidebarLinkComponent = __decorate([
    Component({
        imports: [RouterLink, RouterLinkActive, AsyncPipe, NgTemplateOutlet],
        selector: 'app-sidebar-link',
        styleUrl: './sidebar-link.component.scss',
        templateUrl: './sidebar-link.component.html',
    })
], SidebarLinkComponent);
export { SidebarLinkComponent };
//# sourceMappingURL=sidebar-link.component.js.map