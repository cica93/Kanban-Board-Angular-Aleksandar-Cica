import { Component, inject, InjectionToken, input, signal, output } from '@angular/core';
import { PageResponse } from '@service/abstract.task.service';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellContextMenuEvent,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  PaginationChangedEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { Observable } from 'rxjs';

export type GridDataProviderFunction = (
  filter: string,
  limit: number,
  offset: number,
  sortColumn: string,
  direction: string,
) => Observable<PageResponse<any> | any[]>;
export const GRID_DATA_PROVIDER = new InjectionToken<GridDataProviderFunction>(
  'grid.data.provider',
);

@Component({
  imports: [AgGridAngular],
  selector: 'app-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
})
export class AgGridWrapperComponent<T> {
  columnDefs = input.required<ColDef<T>[]>();
  onCellContextMenu = output<CellContextMenuEvent<T>>();
  onRowClicked = output<RowClickedEvent<T>>();
  pagination = signal(true);
  private readonly dataProvider = inject(GRID_DATA_PROVIDER);
  protected readonly gridOptions: GridOptions = {
    sortingOrder: ['asc', 'desc'],
    rowModelType: 'infinite',
    cacheBlockSize: 50,
    maxBlocksInCache: 1,
    animateRows: true,
    domLayout: 'autoHeight',
  };
  protected readonly defaultColDef: ColDef<T> = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 0,
    filterParams: {
      buttons: ['reset', 'apply'],
    },
  };
  protected paginationPageSize = signal(50);
  protected datasource!: IDatasource;
  protected gridApi!: GridApi<T>;

  constructor() {
    this.datasource = {
      getRows: (params: IGetRowsParams) => {
        const { filterModel, sortModel, startRow, endRow } = params;
        this.dataProvider(
          JSON.stringify(filterModel),
          endRow - startRow,
          startRow,
          sortModel[0]?.colId ?? 'id',
          sortModel[0]?.sort ?? 'desc',
        ).subscribe({
          next: (data: PageResponse<T> | T[]) => {
            if (Array.isArray(data)) {
              this.pagination.set(false);
              params.successCallback(data, data.length);
            } else {
              this.pagination.set(true);
              params.successCallback(data.content, data.totalCount);
            }
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

  changePageSize(pagination: PaginationChangedEvent<T, any>): void {
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

  clearAllFilters(): void {
    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
  }
}
