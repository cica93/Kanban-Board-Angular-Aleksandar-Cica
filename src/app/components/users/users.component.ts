import { AsyncPipe } from '@angular/common';
import { Component, inject, InjectionToken, Injector, Type } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { User, UserService } from 'src/app/services/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserFormComponent } from '../user-form/user-form.component';

export const DIALOG_COMPONENT = new InjectionToken<Type<any>>(
  'DIALOG_COMPONENT',
);

@Component({
  selector: 'app-users',
  imports: [AsyncPipe, TableModule, ButtonModule],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  protected readonly userService = inject(UserService);
  protected readonly users$ = this.userService.getUsers();
  protected readonly dialogService: DialogService = inject(DialogService);
  private readonly dialogComponent = inject(DIALOG_COMPONENT) as Type<any>;
  ref!: DynamicDialogRef<any>;
  injector = inject(Injector);

  editUser(user: User): void {
    const injector = Injector.create({
      providers: [
        {
          provide: DIALOG_COMPONENT,
          useClass: UserFormComponent,
        },
      ],
      parent: this.injector,
    });
    this.ref = this.dialogService.open(this.dialogComponent, {
      header: 'My Dynamic Modal',
      width: '50vw',
      data: { initValue: user }, // Data passed to the modal
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      focusOnShow: false,
      focusTrap: false,
      closable: true,
    });
    // this.ref.onClose.pipe(take(1)).subscribe(() => {
    //   //this.ref.close();
    // })
  }

  deleteUser(user: User): void {}
}
