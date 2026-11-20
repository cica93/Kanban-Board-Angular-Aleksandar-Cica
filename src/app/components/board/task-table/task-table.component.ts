import { Component, inject, injectAsync, Injector, viewChild } from '@angular/core';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';
import {
  AbstractTaskService,
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES_OPTIONS,
} from '@service/abstract.task.service';
import { ColDef } from 'ag-grid-community';
import { SelectComponent } from '../select/select.component';
import {
  AgGridWrapperComponent,
  GRID_DATA_PROVIDER,
  GridDataProviderFunction,
} from '@components/ag-grid-wrapper/ag-grid-wrapper.component';
import { TaskService } from '@service/task.service';
import { DatePipe } from '@angular/common';
import { ModalOptions, SUBMIT_FORM_TOKEN_LOAD } from 'cica-ui';
import { submit } from '@angular/forms/signals';

@Component({
  imports: [AgGridWrapperComponent],
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  providers: [
    DatePipe,
    {
      provide: AbstractTaskService,
      useClass: TaskService,
    },
    {
      provide: SUBMIT_FORM_TOKEN_LOAD,
      useValue: () =>
        import('../../board/task-card/task-form/task-form.component').then(
          (module) => module.TaskFormComponent,
        ),
    },
    {
      provide: GRID_DATA_PROVIDER,
      useFactory: (taskService: TaskService): GridDataProviderFunction => {
        return (
          filter: string,
          limit: number,
          offset: number,
          sortColumn: string,
          direction: string,
        ) => taskService.getTableResponse(filter, limit, offset, sortColumn, direction);
      },
      deps: [TaskService],
    },
  ],
})
export class TaskTableComponent {
  gridWrapper = viewChild.required(AgGridWrapperComponent);
  private readonly injector = inject(Injector);
  private readonly datePipe = inject(DatePipe);
  private readonly modalService = injectAsync(() => import('cica-ui').then((m) => m.ModalService));
  readonly columnDefs: ColDef<Task>[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      sort: 'desc',
      tooltipValueGetter: overflowTooltip,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      tooltipValueGetter: overflowTooltip,
    },

    {
      field: 'taskStatus',
      headerName: 'Status',
      flex: 0.5,
      tooltipValueGetter: overflowTooltip,
      filter: SelectComponent,
      filterParams: {
        items: TASK_STATUSES_OPTIONS,
        bindValue: 'value',
        bindLabel: 'label',
        placeholder: 'Select task status',
        multiple: true,
        id: 'task-status',
        openOnInit: true,
      },
    },
    {
      field: 'taskPriority',
      headerName: 'Priority',
      flex: 0.5,
      tooltipValueGetter: overflowTooltip,
      filter: SelectComponent,
      filterParams: {
        items: TASK_PRIORITIES,
        placeholder: 'Select task priority',
        multiple: true,
        id: 'task-priority',
        openOnInit: true,
      },
    },
    {
      field: 'version',
      headerName: 'Version',
      flex: 0.5,
      tooltipValueGetter: overflowTooltip,
      valueFormatter: ({ value }) => value ?? 0,
      filter: 'agNumberColumnFilter',
      headerClass: 'ag-header-right',
      cellStyle: { textAlign: 'right' },
      filterParams: {
        filterOptions: [
          'equals',
          'notEqual',
          'greaterThan',
          'greaterThanOrEqual',
          'lessThan',
          'lessThanOrEqual',
        ],
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      flex: 0.5,
      tooltipValueGetter: overflowTooltip,
      headerClass: 'ag-header-right',
      cellStyle: { textAlign: 'right' },
      valueFormatter: ({ value }) => this.datePipe.transform(value, 'yyyy-MM-dd') ?? '-',
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Actions',
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      headerComponent: CrudButtonsComponent,
      headerComponentParams: {
        showCreateButton: true,
        showClearButton: true,
        deleteTitle: 'Clear filters',
        entityName: 'Task',
        createClickedFunction: async () => {
          const service = await this.modalService();
          const component = await service.openEditModal({
            injector: this.injector,
            modalOptions: {
              headerText: 'Save Task',
              confirmLabel: 'Save',
            } as ModalOptions,
          });
          component.componentRef.instance.onCancel.subscribe(() => {
            service.close(component.componentRef);
          });
          component.componentRef.instance.onConfirm.subscribe(() => {
            submit(component.submitFormRef.instance.form);
          });
          component.submitFormRef.instance.onSuccess.subscribe(() => {
            service.close(component.componentRef);
          });
        },
        clearClickedFunction: () => {
          this.gridWrapper().clearAllFilters();
        },
      },
      headerClass: 'align-center',
      sortable: false,
      resizable: false,
      maxWidth: 110,

      cellRenderer: CrudButtonsComponent,
      cellRendererParams: {
        entityName: 'User',
        showDeleteButton: true,
        showEditButton: true,
        editClickedFunction: async (task: Task) => {
          const service = await this.modalService();
          const component = await service.openEditModal({
            injector: this.injector,
            modalOptions: {
              initValue: task,
              headerText: 'Edit Task',
              confirmLabel: 'Edit',
            } as ModalOptions,
          });
          component.componentRef.instance.onCancel.subscribe(() => {
            service.close(component.componentRef);
          });
          component.componentRef.instance.onConfirm.subscribe(() => {
            submit(component.submitFormRef.instance.form);
          });
          component.submitFormRef.instance.onSuccess.subscribe(() => {
            service.close(component.componentRef);
          });
        },
        deleteClickedFunction: async () => {
          const service = await this.modalService();
          const component = service.openDeleteModal({
            modalOptions: {} as ModalOptions,
          });
          component.instance.onCancel.subscribe(() => {
            service.close(component);
          });
          component.instance.onConfirm.subscribe(() => {
            service.close(component);
          });
        },
      },
    },
  ];
}

const overflowTooltip = (params: any) => {
  const cell = document.querySelector<HTMLElement>(
    `.ag-row[row-index="${params.rowIndex}"] .ag-cell[col-id="${params.column.getColId()}"]`,
  );

  if (cell!.scrollWidth > cell!.clientWidth) {
    return params.valueFormatted || params.value
      ? String(params.valueFormatted ?? params.value)
      : null;
  }
  return null;
};
