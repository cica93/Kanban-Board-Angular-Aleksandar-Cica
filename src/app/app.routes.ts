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
import { FORM_TOKEN } from '@components/shared/base-dialog/base-dialog.component';
import { TaskFormComponent } from '@components/board/task-card/task-form/task-form.component';

const loginGuard = () => {
  const security = inject(SecurityService);
  return inject(SecurityService).user$.pipe(
    map((user) => {
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
    loadComponent: () => import('./components/board/board.component').then((c) => c.BoardComponent),
    providers: [
      { provide: AbstractTaskService, useExisting: TaskService },
      { provide: FORM_TOKEN, useValue: TaskFormComponent },
    ],
  },
  {
    path: 'users',
    title: 'Users',
    loadComponent: () => import('./components/users/users.component').then((m) => m.UsersComponent),
    canActivate: [loginGuard],
    providers: [{ provide: DIALOG_COMPONENT, useValue: UserFormComponent }],
  },

  {
    path: 'graphql',
    title: 'Graphql',
    canDeactivate: [sidebarGuard],
    loadComponent: () => import('./components/board/board.component').then((c) => c.BoardComponent),
    providers: [
      { provide: AbstractTaskService, useExisting: TaskGraphQlService },
      { provide: FORM_TOKEN, useValue: TaskFormComponent },
    ],
    canActivate: [loginGuard],
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./components/login/login.component').then((c) => c.LoginComponent),
    canActivate: [logoutGuard],
  },
];
