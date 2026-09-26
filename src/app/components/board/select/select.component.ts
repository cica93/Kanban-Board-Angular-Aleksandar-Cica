import { AfterViewInit, Component, model, OnInit, viewChild, input } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TASK_PRIORITIES } from '@service/abstract.task.service';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams, AgPromise } from 'ag-grid-community';
import { FormValueControl } from '@angular/forms/signals';

type SelectIFilterParams = IFilterParams<any, any> & {
  items: any[];
  placeholder: string;
  id: string;
  bindLabel?: string;
  bindValue?: string;
  multiple?: boolean;
  clearOnBackspace?: boolean;
  openOnInit?: boolean;
};

@Component({
  imports: [NgSelectComponent, FormsModule],
  selector: 'app-select',
  templateUrl: './select.component.html',
  host: {
    style: 'width: 100%;',
  },
})
export class SelectComponent
  implements IFilterAngularComp, OnInit, AfterViewInit, FormValueControl<any[] | any | null>
{
  TASK_PRIORITIES = TASK_PRIORITIES;
  select = viewChild.required<NgSelectComponent>(NgSelectComponent);
  items = model.required<any[]>();
  private params!: SelectIFilterParams;
  placeholder = model<string>('Select');
  clearable = model<boolean>(false);
  searchable = model(false);
  openOnEnter = input(false);
  clearOnBackspace = model(false);
  bindLabel = model<string>('');
  bindValue = model<string>('');
  multiple = model<boolean>(false);
  disabled = model<boolean>(false);
  id = model.required<string>();
  isOpen = model<boolean>(false);
  value = model<any[] | any | null>();

  agInit(params: SelectIFilterParams): void {
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
  isFilterActive(): boolean {
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

  setModel(model: any): void | AgPromise<void> {
    this.value.set(model?.values);
  }

  onValueChange(event: any[] | any | null): void {
    if (!this.multiple()) {
      this.isOpen.set(false);
    }
    this.value.set(event);
    this.params.filterChangedCallback();
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    console.log(params);
    return true;
  }

  ngAfterViewInit(): void {
    this.select().writeValue(this.value());
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.params?.openOnInit) {
        this.isOpen.set(true);
      }
    }, 100);
  }
}
