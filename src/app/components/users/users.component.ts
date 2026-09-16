import { Component, inject, Injector, signal } from '@angular/core';
import { User } from '@service/user.service';
import { httpResource } from '@angular/common/http';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { HeaderComponent } from '@components/shared/header/header.component';
import { successModalEvent } from '@components/shared/base-dialog/base-dialog.component';
import { openEditModal } from '@components/shared/modalUtills';
import { IonButton, IonIcon } from '@ionic/angular';
import { createOutline, trashOutline, add } from 'ionicons/icons';
import { TooltipDirective } from 'src/app/directives/tooltip.directive';

@Component({
  selector: 'app-users',
  imports: [SearchInputComponent, HeaderComponent, IonButton, IonIcon, TooltipDirective],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  trashOutlineIcon = trashOutline;
  createOutlineIcon = createOutline;
  addIcon = add;
  keyword = signal('');
  data = httpResource<User[]>(() => `users?keyword=${this.keyword()}`, {
    defaultValue: [],
  });
  private readonly injector = inject(Injector);

  editUser(user: User): void {
    console.log(user);
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

  async openUserkDialog(user?: User): Promise<void> {
    const dialog = await openEditModal(this.injector, user, user ? 'Edit user' : 'Create user');
    this.addUser();
    this.dialogCallBackFunction(dialog);
  }

  async dialogCallBackFunction(dialog: HTMLIonModalElement): Promise<void> {
    const { role } = await dialog.onWillDismiss();
    if (role === successModalEvent) {
      // this.resetTaskFilters();
    }
  }
}
