import {
  Component,
  inject,
  InjectionToken,
  Injector,
  signal,
  Type,
} from '@angular/core';
import { User } from '@service/user.service';
import { httpResource } from '@angular/common/http';
import { SearchInputComponent } from '@components/shared/search-input/search-input.component';
import { HeaderComponent } from '@components/shared/header/header.component';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';

export const DIALOG_COMPONENT = new InjectionToken<Type<any>>(
  'DIALOG_COMPONENT',
);

@Component({
  selector: 'app-users',
  imports: [MatButton, MatRipple, SearchInputComponent, HeaderComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  keyword = signal('');
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
}
