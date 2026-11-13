import { __decorate } from "tslib";
import { Directive, TemplateRef, input, inject } from '@angular/core';
let SidebarLinkTemplateDirective = class SidebarLinkTemplateDirective {
    templateRef = inject((TemplateRef));
    url = input.required();
    label = input();
};
SidebarLinkTemplateDirective = __decorate([
    Directive({
        selector: '[appSidebarLink]',
    })
], SidebarLinkTemplateDirective);
export { SidebarLinkTemplateDirective };
//# sourceMappingURL=sidebar-link-template.directive.js.map