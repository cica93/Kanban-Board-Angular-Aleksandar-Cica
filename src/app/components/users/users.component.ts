import { Component, inject, injectAsync, Injector, signal } from '@angular/core';
import { User } from '@service/user.service';
import { httpResource } from '@angular/common/http';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { HeaderComponent } from '@components/shared/header/header.component';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import {
  BaseDialogComponent,
  FORM_TOKEN,
  successModalEvent,
} from '@components/shared/base-dialog/base-dialog.component';

@Component({
  selector: 'app-users',
  imports: [MatButton, MatRipple, SearchInputComponent, HeaderComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  keyword = signal('');
  private readonly formToken = inject(FORM_TOKEN);
  private readonly modalController = injectAsync(() =>
    import('@ionic/angular').then((a) => a.ModalController),
  );
  data = httpResource<User[]>(() => `users?keyword=${this.keyword()}`, {
    defaultValue: [],
  });
  injector = inject(Injector);

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
    const dialog = await (
      await this.modalController()
    ).create({
      component: BaseDialogComponent,
      componentProps: {
        initValue: signal(user),
        header: signal(user ? 'Edit user' : 'Create user'),
      },
      cssClass: 'custom-modal',
      injector: Injector.create({
        providers: [{ provide: FORM_TOKEN, useValue: this.formToken }],
      }),
    });
    dialog.present();
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
