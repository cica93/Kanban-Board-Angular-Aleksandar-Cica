import { __decorate } from "tslib";
import { Component, input, model } from '@angular/core';
let SidebarWrapperComponent = class SidebarWrapperComponent {
    size = model('sm');
    position = input('left');
    theme = input('light');
    toggleMenu() {
        this.size.update((value) => (value === 'sm' ? 'lg' : 'sm'));
    }
};
SidebarWrapperComponent = __decorate([
    Component({
        imports: [],
        selector: 'app-sidebar-wrapper',
        styleUrl: './sidebar-wrapper.component.scss',
        templateUrl: './sidebar-wrapper.component.html',
    })
], SidebarWrapperComponent);
export { SidebarWrapperComponent };
//# sourceMappingURL=sidebar-wrapper.component.js.map