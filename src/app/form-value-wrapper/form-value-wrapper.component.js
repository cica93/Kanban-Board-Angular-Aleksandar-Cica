import { __decorate } from "tslib";
import { TitleCasePipe } from '@angular/common';
import { Component, computed, contentChild, input } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatError, MatHint } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
let FormValueWrapperComponent = class FormValueWrapperComponent {
    label = input('');
    name = input('');
    control = contentChild((FormField));
    errorMessage = computed(() => {
        const errors = this.control()?.errors?.();
        return errors && errors[0] && errors[0].message;
    });
    hidden = computed(() => this.control()?.state()?.hidden() ?? false);
    required = computed(() => this.control()?.state()?.required() ?? false);
    pending = computed(() => this.control()?.state()?.pending() ?? false);
    invalid = computed(() => this.control()?.state().invalid() ?? false);
    touched = computed(() => this.control()?.state().touched?.() ?? false);
};
FormValueWrapperComponent = __decorate([
    Component({
        selector: 'app-form-value-wrapper',
        imports: [TitleCasePipe, MatProgressSpinnerModule, MatError, MatHint],
        templateUrl: './form-value-wrapper.component.html',
        host: {
            class: 'flex flex-column gap-1',
            '[class.hidden]': 'hidden()',
            '[class.invalid]': 'invalid()',
            '[class.touched]': 'touched()',
        },
    })
], FormValueWrapperComponent);
export { FormValueWrapperComponent };
//# sourceMappingURL=form-value-wrapper.component.js.map