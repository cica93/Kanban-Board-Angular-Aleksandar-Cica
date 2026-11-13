import { __decorate } from "tslib";
import { Component, model, viewChild, input } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TASK_PRIORITIES } from '@service/abstract.task.service';
let SelectComponent = class SelectComponent {
    TASK_PRIORITIES = TASK_PRIORITIES;
    select = viewChild.required(NgSelectComponent);
    items = model.required();
    params;
    placeholder = model('Select');
    clearable = model(false);
    searchable = model(false);
    openOnEnter = input(false);
    clearOnBackspace = model(false);
    bindLabel = model('');
    bindValue = model('');
    multiple = model(false);
    disabled = model(false);
    id = model.required();
    isOpen = model(false);
    value = model();
    agInit(params) {
        this.params = params;
        const { items, placeholder, id, bindLabel, bindValue, multiple, clearOnBackspace } = params;
        this.items.set(items);
        this.placeholder.set(placeholder);
        this.id.set(id);
        this.bindLabel.set(bindLabel ?? '');
        this.bindValue.set(bindValue ?? '');
        this.multiple.set(multiple ?? false);
        this.clearable.set(true);
        this.searchable.set(true);
        this.clearOnBackspace.set(clearOnBackspace ?? false);
    }
    isFilterActive() {
        return !this.multiple() ? !!this.value() : !!this.value()?.length;
    }
    getModel() {
        if (!this.value()) {
            return null;
        }
        return {
            filterType: 'text',
            type: 'equals',
            filter: this.value(),
        };
    }
    setModel(model) {
        this.value.set(model?.values);
    }
    onValueChange(event) {
        if (!this.multiple()) {
            this.isOpen.set(false);
        }
        this.value.set(event);
        this.params.filterChangedCallback();
    }
    doesFilterPass(params) {
        console.log(params);
        return true;
    }
    ngAfterViewInit() {
        this.select().writeValue(this.value());
    }
    ngOnInit() {
        setTimeout(() => {
            if (this.params?.openOnInit) {
                this.isOpen.set(true);
            }
        }, 100);
    }
};
SelectComponent = __decorate([
    Component({
        imports: [NgSelectComponent, FormsModule],
        selector: 'app-select',
        templateUrl: './select.component.html',
        host: {
            style: 'width: 100%;',
        },
    })
], SelectComponent);
export { SelectComponent };
//# sourceMappingURL=select.component.js.map