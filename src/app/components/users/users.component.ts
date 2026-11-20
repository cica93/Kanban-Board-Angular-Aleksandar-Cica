import { Component, inject, injectAsync, Injector, signal } from '@angular/core';
import { User, UserService } from '@service/user.service';
import { CrudButtonsComponent } from '@components/shared/crud-buttons/crud-buttons.component';
import {
  AgGridWrapperComponent,
  GRID_DATA_PROVIDER,
  GridDataProviderFunction,
} from '@components/ag-grid-wrapper/ag-grid-wrapper.component';

import { CellContextMenuEvent, ColDef, GridApi } from 'ag-grid-community';
import { map } from 'rxjs';
import { ModalOptions, SUBMIT_FORM_TOKEN_LOAD } from 'cica-ui';
import { submit } from '@angular/forms/signals';

@Component({
  selector: 'app-users',
  styleUrl: './users.component.scss',
  imports: [AgGridWrapperComponent],
  providers: [
    {
      provide: GRID_DATA_PROVIDER,
      useFactory: (userService: UserService): GridDataProviderFunction => {
        return (
          filter: string,
          limit: number,
          offset: number,
          sortColumn: string,
          direction: string,
        ) =>
          userService
            .getUsers(filter, limit, offset, sortColumn, direction)
            .pipe(map(({ content }) => content));
      },
      deps: [UserService],
    },
    {
      provide: SUBMIT_FORM_TOKEN_LOAD,
      useValue: () =>
        import('../user-form/user-form.component').then((module) => module.UserFormComponent),
    },
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  contentMenuEvent = signal<Event | null | undefined>(null);
  firstInpuChange = true;
  contentMenuOpen = signal(false);
  private readonly modalService = injectAsync(() => import('cica-ui').then((m) => m.ModalService));
  private readonly injector = inject(Injector);

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
        editClickedFunction: (user: User) => {
          this.openUserkDialog(user);
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

  editUser(user?: User): void {
    console.log(user ?? this.selectedUser());
  }

  deleteUser(deleteUser?: User): void {
    console.log(deleteUser);
    // this.data.update((users) =>
    //   users.filter((user) => user.id !== (deleteUser || this.selectedUser())?.id),
    // );
  }

  onCellContextMenu({ event, data }: CellContextMenuEvent<User>): void {
    this.contentMenuEvent.set(event);
    this.contentMenuOpen.set(true);
    this.selectedUser.set(data ?? null);
  }

  //'infinite' | 'viewport' | 'clientSide' | 'serverSide'

  addUser(): void {
    // this.data.update((users) => [
    //   { fullName: 'Saban', email: 's@gmail.com', id: 76 } as unknown as User,
    //   ...users,
    // ]);
  }

  async openUserkDialog(user?: User): Promise<void> {
    const service = await this.modalService();
    const label = user ? 'Edit' : 'Save';
    const { componentRef, submitFormRef } = await service.openEditModal({
      injector: this.injector,
      modalOptions: {
        initValue: user,
        headerText: `${label} User`,
        confirmLabel: label,
      } as ModalOptions,
    });
    componentRef.instance.onCancel.subscribe(() => {
      service.close(componentRef);
    });
    componentRef.instance.onConfirm.subscribe(() => {
      submit(submitFormRef.instance.form);
    });
    submitFormRef.instance.onSuccess.subscribe(() => {
      service.close(componentRef);
    });
  }

  dialogCallBackFunction(dialog: any): void {
    console.log(dialog);
  }
}
