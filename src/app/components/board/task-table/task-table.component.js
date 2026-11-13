import { __decorate } from "tslib";
import { Component, inject, viewChild } from '@angular/core';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';
import { TASK_PRIORITIES, TASK_STATUSES_OPTIONS } from '@service/abstract.task.service';
import { SelectComponent } from '../select/select.component';
import { AgGridWrapperComponent, GRID_DATA_PROVIDER, } from '@components/ag-grid-wrapper/ag-grid-wrapper.component';
import { TaskService } from '@service/task.service';
import { DatePipe } from '@angular/common';
let TaskTableComponent = class TaskTableComponent {
    gridWrapper = viewChild.required(AgGridWrapperComponent);
    datePipe = inject(DatePipe);
    columnDefs = [
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
                entityName: 'User',
                createClickedFunction: () => {
                    console.log('create');
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
                editClickedFunction: (task) => {
                    console.log(task);
                },
                deleteClickedFunction: (task) => {
                    console.log(task);
                },
            },
        },
    ];
};
TaskTableComponent = __decorate([
    Component({
        imports: [AgGridWrapperComponent, IonGrid, IonRow, IonCol, AgGridWrapperComponent],
        selector: 'app-task-table',
        templateUrl: './task-table.component.html',
        providers: [
            DatePipe,
            {
                provide: GRID_DATA_PROVIDER,
                useFactory: (taskService) => {
                    return (filter, limit, offset, sortColumn, direction) => taskService.getTableResponse(filter, limit, offset, sortColumn, direction);
                },
                deps: [TaskService],
            },
        ],
    })
], TaskTableComponent);
export { TaskTableComponent };
const overflowTooltip = (params) => {
    const cell = document.querySelector(`.ag-row[row-index="${params.rowIndex}"] .ag-cell[col-id="${params.column.getColId()}"]`);
    if (cell.scrollWidth > cell.clientWidth) {
        return params.valueFormatted || params.value
            ? String(params.valueFormatted ?? params.value)
            : null;
    }
    return null;
};
//# sourceMappingURL=task-table.component.js.map