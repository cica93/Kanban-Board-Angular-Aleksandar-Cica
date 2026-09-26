import { Component, OnInit, signal, viewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TASK_PRIORITIES } from '@service/abstract.task.service';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams, AgPromise } from 'ag-grid-community';

@Component({
  imports: [NgSelectComponent, FormsModule],
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
})
export class SelectFilterComponent implements IFilterAngularComp, OnInit {
  TASK_PRIORITIES = TASK_PRIORITIES;
  selectedPriority: string[] | null = null;
  select = viewChild.required<NgSelectComponent>(NgSelectComponent);
  private params!: IFilterParams;
  items: any[] = [];
  placeholder: string = '';
  bindLabel = '';
  bindValue = '';
  id: string = '';
  isOpen = signal(false);

  agInit(
    params: IFilterParams<any, any> & {
      items: any[];
      placeholder: string;
      id: string;
      bindLabel?: string;
      bindValue?: string;
    },
  ): void {
    this.params = params;
    this.items = params.items;
    this.placeholder = params.placeholder;
    this.id = params.id;
    this.bindLabel = params.bindLabel ?? '';
    this.bindValue = params.bindValue ?? '';
  }
  isFilterActive(): boolean {
    return !!this.selectedPriority?.length;
  }

  getModel() {
    if (!this.selectedPriority) {
      return null;
    }

    return {
      filterType: 'text',
      type: 'equals',
      filter: this.selectedPriority,
    };
  }

  setModel(model: any): void | AgPromise<void> {
    this.selectedPriority = model?.values ?? [];
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    console.log(params);
    return true;
  }

  onPriorityChange(newValue: string[] | null) {
    this.selectedPriority = newValue;
    this.params.filterChangedCallback();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isOpen.set(true);
    }, 100);
  }
}
