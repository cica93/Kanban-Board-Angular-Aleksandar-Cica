import { Component, inject, Injector, signal } from '@angular/core';
import { User, UserService } from '@service/user.service';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { HeaderComponent } from '@components/shared/header/header.component';
import { successModalEvent } from '@components/shared/base-dialog/base-dialog.component';
import { openEditModal } from '@components/shared/modalUtills';
import { IonGrid, IonRow, IonCol, IonList, IonIcon, IonItem, IonLabel } from '@ionic/angular';
import { createOutline, trashOutline, add } from 'ionicons/icons';
import {
  CellContextMenuEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  IGetRowsParams,
  RowClickedEvent,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';
import { IonPopover } from '@ionic/angular/common';

@Component({
  selector: 'app-users',
  styleUrl: './users.component.scss',
  imports: [
    SearchInputComponent,
    HeaderComponent,
    AgGridAngular,
    IonGrid,
    IonRow,
    IonCol,
    IonPopover,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  trashOutlineIcon = trashOutline;
  createOutlineIcon = createOutline;
  addIcon = add;
  contentMenuEvent = signal<Event | null | undefined>(null);
  firstInpuChange = true;

  keyword = signal('');
  contentMenuOpen = signal(false);
  private readonly userService = inject(UserService);

  protected gridApi!: GridApi<User>;

  selectedUser = signal<User | null>(null);
  contextMenuEvent = signal<MouseEvent | null>(null);

  readonly rowSelection = {
    mode: 'singleRow',
  };

  readonly columnDefs: ColDef<User>[] = [
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
        editClickedFunction: (user: User) => {
          this.editUser(user);
        },
        deleteClickedFunction: (user: User) => {
          this.deleteUser(user);
        },
      },
    },
  ];

  readonly defaultColDef: ColDef<User> = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 0,
  };

  private readonly injector = inject(Injector);

  editUser(user?: User): void {
    console.log(user ?? this.selectedUser());
  }

  deleteUser(deleteUser?: User): void {
    console.log(deleteUser);
    // this.data.update((users) =>
    //   users.filter((user) => user.id !== (deleteUser || this.selectedUser())?.id),
    // );
  }

  addUser(): void {
    // this.data.update((users) => [
    //   { fullName: 'Saban', email: 's@gmail.com', id: 76 } as unknown as User,
    //   ...users,
    // ]);
  }

  async openUserkDialog(user?: User): Promise<void> {
    const dialog = await openEditModal(this.injector, user, user ? 'Edit user' : 'Create user');
    this.addUser();
    this.dialogCallBackFunction(dialog);
  }

  async dialogCallBackFunction(dialog: HTMLIonModalElement): Promise<void> {
    const { role } = await dialog.onWillDismiss();
    if (role === successModalEvent) {
      //this.resetTaskFilters();
    }
  }

  onRowClicked(event: RowClickedEvent<User>): void {
    const user = event.data;
    event.node.setSelected(true);

    if (!user) {
      return;
    }
  }

  onCellContextMenu({ event, data }: CellContextMenuEvent<User>): void {
    this.contentMenuEvent.set(event);
    this.contentMenuOpen.set(true);
    this.selectedUser.set(data ?? null);
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    event.api.setGridOption('datasource', {
      getRows: (params: IGetRowsParams) => {
        const { startRow, endRow, sortModel, filterModel } = params;

        console.log(filterModel);
        this.userService
          .getUsers(
            this.keyword(),
            endRow - startRow,
            startRow,
            sortModel[0]?.colId,
            sortModel[0]?.sort,
          )
          .subscribe({
            next: ({ content, totalCount }) => {
              params.successCallback(content, totalCount);
            },
            error: () => {
              params.failCallback();
            },
          });
      },
    });
  }

  inputChange(event: string): void {
    if (this.firstInpuChange) {
      this.firstInpuChange = false;
    } else {
      this.keyword.set(event);
      this.gridApi.applyColumnState({
        state: [{ colId: 'fullName', sort: 'desc' }],
      });
      this.gridApi.refreshInfiniteCache();
    }
  }
}
