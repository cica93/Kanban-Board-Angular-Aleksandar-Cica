import { Component, input, model, output } from '@angular/core';
import { TooltipDirective } from 'cica-ui';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { SvgIconDirective } from '../svg-icon.directive';

@Component({
  imports: [TooltipDirective, SvgIconDirective],
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
    this.showClearButton.set(params.showClearButton);
    this.editClickedFunction = params.editClickedFunction;
    this.deleteClickedFunction = params.deleteClickedFunction;
    this.clearClickedFunction = params.clearClickedFunction;
    this.createClickedFunction = params.createClickedFunction;
  }

  protected closeIcon = close;
  private editClickedFunction: (a: any) => void = () => {};
  private deleteClickedFunction: (a: any) => void = () => {};
  private createClickedFunction: () => void = () => {};
  private clearClickedFunction: () => void = () => {};
  entity = model<any>();
  entityName = model<any>();
  editClicked = output<any>();
  deleteClicked = output<any>();
  createClicked = output<void>();
  clearClicked = output<void>();

  showDeleteButton = model(true);
  showClearButton = model(false);
  showEditButton = model(true);
  showCreateButton = model(false);

  deleteText = input<string | undefined>();
  editText = input<string | undefined>();
  createText = input<string | undefined>();

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

  close(): void {
    this.clearClickedFunction();
    this.clearClicked.emit();
  }
}
