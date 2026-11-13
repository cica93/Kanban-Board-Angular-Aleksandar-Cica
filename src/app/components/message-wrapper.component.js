import { __decorate } from "tslib";
import { Component, computed, input } from '@angular/core';
let MessageWrapperComponent = class MessageWrapperComponent {
    type = input('error');
    hostClasses = computed(() => {
        const color = this.type() === 'error' ? 'red' : 'orange';
        return `text-${color}-500 small-text`;
    });
};
MessageWrapperComponent = __decorate([
    Component({
        selector: 'app-message-wrapper',
        imports: [],
        template: '<ng-content></ng-content>',
        host: { '[class]': 'hostClasses()' },
    })
], MessageWrapperComponent);
export { MessageWrapperComponent };
//# sourceMappingURL=message-wrapper.component.js.map