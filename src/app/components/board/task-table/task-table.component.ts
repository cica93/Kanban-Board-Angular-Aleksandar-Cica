import { Component, inject, signal } from '@angular/core';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { PageResponse, Task, TASK_PRIORITIES, TASK_STATUSES_OPTIONS } from '@service/abstract.task.service';
import { TaskService } from '@service/task.service';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, PaginationChangedEvent } from 'ag-grid-community';
import { SelectFilterComponent } from '../select-filter/select-filter.component';

@Component({
  imports: [AgGridAngular, IonGrid, IonRow, IonCol],
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
})
export class TaskTableComponent {
  gridOptions: GridOptions = {
    sortingOrder: ['asc', 'desc'],
    rowModelType: 'infinite',
    cacheBlockSize: 50,
    maxBlocksInCache: 1,
    animateRows: true,
    domLayout: 'autoHeight',
    pagination: true,
  };
  paginationPageSize = signal(50);
  datasource!: IDatasource;
  private readonly taskService = inject(TaskService);
  protected gridApi!: GridApi<Task>;
  readonly columnDefs: ColDef<Task>[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      sort: 'desc',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'taskStatus',
      headerName: 'Status',
      flex: 1,
      filter: SelectFilterComponent,
      filterParams: {
        items: TASK_STATUSES_OPTIONS,
        bindValue: 'value',
        bindLabel: 'label',
        placeholder: 'Select task status',
        multiple: true,
        id: 'task-status',
      },
    },
    {
      field: 'taskPriority',
      headerName: 'Priority',
      flex: 1,
      filter: SelectFilterComponent,
      filterParams: {
        items: TASK_PRIORITIES,
        placeholder: 'Select task priority',
        multiple: true,
        id: 'task-priority',
      },
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
        entityName: 'User',
        createClickedFunction: () => {
          console.log('create');
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
        editClickedFunction: (task: Task) => {
          console.log(task);
        },
        deleteClickedFunction: (task: Task) => {
          console.log(task);
        },
      },
    },
  ];

  constructor() {
    this.datasource = {
      getRows: (params: IGetRowsParams) => {
        const { filterModel, sortModel, startRow, endRow } = params;
        this.taskService
          .getTableResponse(
            JSON.stringify(filterModel),
            endRow - startRow,
            startRow,
            sortModel[0]?.colId ?? 'id',
            sortModel[0]?.sort ?? 'desc',
          )
          .subscribe({
            next: ({ content, totalCount }: PageResponse<Task>) => {
              params.successCallback(content, totalCount);
            },
            error: () => {
              params.failCallback();
            },
          });
      },
    };
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
  }

  bodyScroll(event: any): void {
    console.log(event);
  }

  changePageSize(pagination: PaginationChangedEvent<Task, any>): void {
    const { api } = pagination;
    const pageSize = api.paginationGetPageSize();

    if (pageSize !== this.paginationPageSize()) {
      this.paginationPageSize.set(pageSize);
      api.setGridOption('cacheBlockSize', pageSize);
      api.setGridOption('paginationPageSize', pageSize);
      api.paginationGoToFirstPage();
      api.refreshInfiniteCache();
    }
  }

  readonly defaultColDef: ColDef<Task> = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 0,
  };
}
