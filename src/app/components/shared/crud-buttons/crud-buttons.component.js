import { __decorate } from "tslib";
import { Component, model, output } from '@angular/core';
import { TooltipDirective } from '@directives/tooltip.directive';
import { IonButton, IonIcon } from '@ionic/angular';
import { createOutline, trashOutline, add, close } from 'ionicons/icons';
let CrudButtonsComponent = class CrudButtonsComponent {
    agInit(params) {
        this.setParams(params);
    }
    refresh(params) {
        this.setParams(params);
        return true;
    }
    setParams(params) {
        this.entity.set(params.data);
        this.entityName.set(params.entityName);
        this.showCreateButton.set(params.showCreateButton);
        this.showEditButton.set(params.showEditButton);
        this.showDeleteButton.set(params.showDeleteButton);
        this.showClearButton.set(params.showClearButton);
        this.editClickedFunction = params.editClickedFunction;
        this.deleteClickedFunction = params.deleteClickedFunction;
        this.clearClickedFunction = params.clearClickedFunction;
        this.createClickedFunction = params.createClickedFunction;
    }
    createOutlineIcon = createOutline;
    trashOutlineIcon = trashOutline;
    addIcon = add;
    closeIcon = close;
    editClickedFunction = () => { };
    deleteClickedFunction = () => { };
    createClickedFunction = () => { };
    clearClickedFunction = () => { };
    entity = model();
    entityName = model();
    editClicked = output();
    deleteClicked = output();
    createClicked = output();
    clearClicked = output();
    showDeleteButton = model(true);
    showClearButton = model(false);
    showEditButton = model(true);
    showCreateButton = model(false);
    editEntity() {
        this.editClickedFunction(this.entity());
        this.editClicked.emit(this.entity());
    }
    deleteEntity() {
        this.deleteClickedFunction(this.entity());
        this.deleteClicked.emit(this.entity());
    }
    createEntity() {
        this.createClickedFunction();
        this.createClicked.emit();
    }
    close() {
        this.clearClickedFunction();
        this.clearClicked.emit();
    }
};
CrudButtonsComponent = __decorate([
    Component({
        imports: [TooltipDirective, IonButton, IonIcon],
        selector: 'app-crud-buttons',
        styleUrl: './crud-buttons.component.scss',
        templateUrl: './crud-buttons.component.html',
    })
], CrudButtonsComponent);
export { CrudButtonsComponent };
//# sourceMappingURL=crud-buttons.component.js.map