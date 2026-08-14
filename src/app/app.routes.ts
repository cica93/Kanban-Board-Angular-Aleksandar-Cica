import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SecurityService } from '@service/security.service';
import { TaskService } from '@service/task.service';
import { TaskGraphQlService } from '@service/task.graphql.service';
import { AbstractTaskService } from '@service/abstract.task.service';
import { sidebarGuard } from './guards/sidebar.guard';
import { UserFormComponent } from './components/user-form/user-form.component';
import { DIALOG_COMPONENT } from './components/users/users.component';

const loginGuard = () => {
  const security = inject(SecurityService);
  return inject(SecurityService).user$.pipe(
    map((user) => {
      console.log(user);
      if (!user) {
        security.logout();
      }
      return !!user;
    }),
  );
};

const logoutGuard = () => {
  const router = inject(Router);
  return inject(SecurityService).user$.pipe(
    map((user) => {
      if (user) {
        router.navigate(['/rest']);
      }
      return !user;
    }),
  );
};

export const routes: Routes = [
  {
    path: 'rest',
    title: 'Rest',
    canDeactivate: [sidebarGuard],
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent,
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
  },
  {
    path: 'task-dialog',
    outlet: 'sidebar',
    loadComponent: () =>
      import('./components/board/task-card/task-dialog/task-dialog.component').then(
        (c) => c.TaskDialogComponent,
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: 'user-dialog',
    outlet: 'sidebar',
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(
        (m) => m.UserFormComponent,
      ),
    canActivate: [loginGuard],
  },
  {
    path: 'users',
    title: 'Users',
    loadComponent: () =>
      import('./components/users/users.component').then(
        (m) => m.UsersComponent,
      ),
    canActivate: [loginGuard],
    providers: [{ provide: DIALOG_COMPONENT, useValue: UserFormComponent }],
  },
  {
    path: '',
    title: 'Rest',
    canDeactivate: [sidebarGuard],
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent,
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: 'graphql',
    title: 'Graphql',
    canDeactivate: [sidebarGuard],
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent,
      ),
    providers: [
      { provide: AbstractTaskService, useExisting: TaskGraphQlService },
    ],
    canActivate: [loginGuard],
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent,
      ),
    canActivate: [logoutGuard],
  },
];
