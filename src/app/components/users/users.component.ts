import {
  Component,
  inject,
  InjectionToken,
  Injector,
  signal,
  Type,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { User } from '@service/user.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { httpResource } from '@angular/common/http';
import { SearchInputComponent } from '@components/search-input/search-input.component';
import { HeaderComponent } from '@components/header/header.component';

export const DIALOG_COMPONENT = new InjectionToken<Type<any>>(
  'DIALOG_COMPONENT',
);

@Component({
  selector: 'app-users',
  imports: [TableModule, ButtonModule, SearchInputComponent, HeaderComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  keyword = signal('');
  data = httpResource<User[]>(() => `users?keyword=${this.keyword()}`, {
    defaultValue: [],
  });
  protected readonly dialogService: DialogService = inject(DialogService);
  private readonly dialogComponent = inject(DIALOG_COMPONENT) as Type<any>;
  ref!: DynamicDialogRef<any>;
  injector = inject(Injector);

  editUser(user: User): void {
    this.ref = this.dialogService.open<Type<any>>(this.dialogComponent, {
      header: 'My Dynamic Modal',
      width: '50vw',
      data: { initValue: user }, // Data passed to the modal
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      focusOnShow: false,
      focusTrap: false,
      closable: true,
    })!;
    this.ref.onClose.pipe(take(1)).subscribe(() => {
      this.ref.close();
    });
  }

  deleteUser({ id }: User): void {
    this.data.update((users) => users.filter((user) => user.id !== id));
  }

  addUser(): void {
    this.data.update((users) => [
      { fullName: 'Saban', email: 's@gmail.com', id: 76 } as unknown as User,
      ...users,
    ]);
  }
}
