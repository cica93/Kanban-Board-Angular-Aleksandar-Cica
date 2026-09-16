import { Component, model, output } from '@angular/core';
import { TooltipDirective } from '@directives/tooltip.directive';
import { IonButton, IonIcon } from '@ionic/angular';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { createOutline, trashOutline } from 'ionicons/icons';

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
    this.entityName.set(params.entityName)
    this.editClickedFunction = params.editClickedFunction;
    this.deleteClickedFunction = params.deleteClickedFunction;
  }

  protected createOutlineIcon = createOutline;
  protected trashOutlineIcon = trashOutline;
  private editClickedFunction: (a: any) => void = () => {};
  private deleteClickedFunction: (a: any) => void = () => {};
  entity = model<any>();
  entityName = model<any>();
  editClicked = output<any>();
  deleteClicked = output<any>();

  editEntity(): void {
    this.editClickedFunction(this.entity());
    this.editClicked.emit(this.entity());
  }

  deleteEntity(): void {
    this.deleteClickedFunction(this.entity());
    this.deleteClicked.emit(this.entity());
  }
}
