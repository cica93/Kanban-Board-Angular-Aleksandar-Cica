import { __decorate } from "tslib";
import { Component, inject, Injector, signal } from '@angular/core';
import { UserService } from '@service/user.service';
import { successModalEvent } from '@components/shared/base-dialog/base-dialog.component';
import { openEditModal } from '@components/shared/modalUtills';
import { IonGrid, IonRow, IonCol, IonList, IonIcon, IonItem, IonLabel } from '@ionic/angular';
import { createOutline, trashOutline, add } from 'ionicons/icons';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';
import { IonPopover } from '@ionic/angular/common';
import { AgGridWrapperComponent, GRID_DATA_PROVIDER, } from '@components/ag-grid-wrapper/ag-grid-wrapper.component';
import { map } from 'rxjs';
let UsersComponent = class UsersComponent {
    trashOutlineIcon = trashOutline;
    createOutlineIcon = createOutline;
    addIcon = add;
    contentMenuEvent = signal(null);
    firstInpuChange = true;
    contentMenuOpen = signal(false);
    gridApi;
    selectedUser = signal(null);
    contextMenuEvent = signal(null);
    rowSelection = {
        mode: 'singleRow',
    };
    columnDefs = [
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 1,
            sort: 'desc',
            valueFormatter: ({ value }) => value?.toUpperCase(),
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
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
                    this.openUserkDialog();
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
                editClickedFunction: (user) => {
                    this.openUserkDialog(user);
                },
                deleteClickedFunction: (user) => {
                    this.deleteUser(user);
                },
            },
        },
    ];
    defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 0,
    };
    injector = inject(Injector);
    editUser(user) {
        console.log(user ?? this.selectedUser());
    }
    deleteUser(deleteUser) {
        console.log(deleteUser);
        // this.data.update((users) =>
        //   users.filter((user) => user.id !== (deleteUser || this.selectedUser())?.id),
        // );
    }
    //'infinite' | 'viewport' | 'clientSide' | 'serverSide'
    addUser() {
        // this.data.update((users) => [
        //   { fullName: 'Saban', email: 's@gmail.com', id: 76 } as unknown as User,
        //   ...users,
        // ]);
    }
    async openUserkDialog(user) {
        const dialog = await openEditModal(this.injector, user, user ? 'Edit user' : 'Create user');
        this.addUser();
        this.dialogCallBackFunction(dialog);
    }
    async dialogCallBackFunction(dialog) {
        const { role } = await dialog.onWillDismiss();
        if (role === successModalEvent) {
            //this.resetTaskFilters();
        }
    }
    onRowClicked(event) {
        const user = event.data;
        event.node.setSelected(true);
        if (!user) {
            return;
        }
    }
    onCellContextMenu({ event, data }) {
        this.contentMenuEvent.set(event);
        this.contentMenuOpen.set(true);
        this.selectedUser.set(data ?? null);
    }
};
UsersComponent = __decorate([
    Component({
        selector: 'app-users',
        styleUrl: './users.component.scss',
        imports: [
            AgGridWrapperComponent,
            IonGrid,
            IonRow,
            IonCol,
            IonPopover,
            IonList,
            IonItem,
            IonIcon,
            IonLabel,
        ],
        providers: [
            {
                provide: GRID_DATA_PROVIDER,
                useFactory: (userService) => {
                    return (filter, limit, offset, sortColumn, direction) => userService
                        .getUsers(filter, limit, offset, sortColumn, direction)
                        .pipe(map((e) => e.content));
                },
                deps: [UserService],
            },
        ],
        templateUrl: './users.component.html',
    })
], UsersComponent);
export { UsersComponent };
//# sourceMappingURL=users.component.js.map