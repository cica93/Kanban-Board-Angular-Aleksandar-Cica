import { Component, model, output } from '@angular/core';
import { TooltipDirective } from '@directives/tooltip.directive';
import { IonButton, IonIcon } from '@ionic/angular';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { createOutline, trashOutline, add } from 'ionicons/icons';

@Component({
  imports: [TooltipDirective, IonButton, IonIcon],
  selector: 'app-crud-buttons',
  styleUrl: './crud-buttons.component.scss',
  templateUrl: './crud-buttons.component.html',
})
export class CrudButtonsComponent implements ICellRendererAngularComp {
  agInit(params: ICellRendererParams<any>): void {
    this.setParams(params);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.setParams(params);
    return true;
  }

  private setParams(params: any) {
    this.entity.set(params.data);
    this.entityName.set(params.entityName);
    this.showCreateButton.set(params.showCreateButton);
    this.showEditButton.set(params.showEditButton);
    this.showDeleteButton.set(params.showDeleteButton);
    this.editClickedFunction = params.editClickedFunction;
    this.deleteClickedFunction = params.deleteClickedFunction;
    this.createClickedFunction = params.createClickedFunction;
  }

  protected createOutlineIcon = createOutline;
  protected trashOutlineIcon = trashOutline;
  protected addIcon = add;
  private editClickedFunction: (a: any) => void = () => {};
  private deleteClickedFunction: (a: any) => void = () => {};
  private createClickedFunction: () => void = () => {};
  entity = model<any>();
  entityName = model<any>();
  editClicked = output<any>();
  deleteClicked = output<any>();
  createClicked = output<void>();

  showDeleteButton = model(true);
  showEditButton = model(true);
  showCreateButton = model(false);

  editEntity(): void {
    this.editClickedFunction(this.entity());
    this.editClicked.emit(this.entity());
  }

  deleteEntity(): void {
    this.deleteClickedFunction(this.entity());
    this.deleteClicked.emit(this.entity());
  }

  createEntity(): void {
    this.createClickedFunction();
    this.createClicked.emit();
  }
}
