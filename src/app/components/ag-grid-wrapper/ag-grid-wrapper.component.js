import { __decorate } from "tslib";
import { Component, inject, InjectionToken, input, signal, output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
export const GRID_DATA_PROVIDER = new InjectionToken('grid.data.provider');
let AgGridWrapperComponent = class AgGridWrapperComponent {
    columnDefs = input.required();
    onCellContextMenu = output();
    onRowClicked = output();
    pagination = signal(true);
    dataProvider = inject(GRID_DATA_PROVIDER);
    gridOptions = {
        sortingOrder: ['asc', 'desc'],
        rowModelType: 'infinite',
        cacheBlockSize: 50,
        maxBlocksInCache: 1,
        animateRows: true,
        enableBrowserTooltips: false,
        domLayout: 'normal',
        tooltipShowDelay: 0,
        headerHeight: 49,
        rowHeight: 42,
        tooltipHideDelay: 3000,
        suppressContextMenu: true,
        suppressDragLeaveHidesColumns: true,
        suppressMakeColumnVisibleAfterUnGroup: true,
    };
    defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 0,
        filterParams: {
            buttons: ['reset', 'apply'],
        },
    };
    paginationPageSize = signal(50);
    datasource;
    gridApi;
    tableHeight = signal('100%');
    constructor() {
        this.datasource = {
            getRows: (params) => {
                const { filterModel, sortModel, startRow, endRow } = params;
                this.dataProvider(JSON.stringify(filterModel), endRow - startRow, startRow, sortModel[0]?.colId ?? 'id', sortModel[0]?.sort ?? 'desc').subscribe({
                    next: (data) => {
                        if (Array.isArray(data)) {
                            this.pagination.set(false);
                            params.successCallback(data, data.length);
                            this.tableHeight.set(`${data.length * this.gridOptions.rowHeight + this.gridOptions.headerHeight}px`);
                        }
                        else {
                            this.pagination.set(true);
                            params.successCallback(data.content, data.totalCount);
                            this.tableHeight.set('100%');
                        }
                    },
                    error: () => {
                        params.failCallback();
                    },
                });
            },
        };
    }
    onGridReady(event) {
        this.gridApi = event.api;
    }
    changePageSize(pagination) {
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
    clearAllFilters() {
        this.gridApi.setFilterModel(null);
        this.gridApi.onFilterChanged();
    }
};
AgGridWrapperComponent = __decorate([
    Component({
        imports: [AgGridAngular],
        selector: 'app-ag-grid-wrapper',
        templateUrl: './ag-grid-wrapper.component.html',
        host: {
            style: 'display: flex; width: 100%;',
            '[style.height]': 'tableHeight()',
        },
    })
], AgGridWrapperComponent);
export { AgGridWrapperComponent };
//# sourceMappingURL=ag-grid-wrapper.component.js.map