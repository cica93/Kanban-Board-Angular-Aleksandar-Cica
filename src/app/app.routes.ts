import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SecurityService } from '@service/security.service';
import { TaskService } from '@service/task.service';
import { TaskGraphQlService } from '@service/task.graphql.service';
import { AbstractTaskService } from '@service/abstract.task.service';
import { sidebarGuard } from './guards/sidebar.guard';
import { FORM_TOKEN } from '@components/shared/base-dialog/base-dialog.component';

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
    path: '',
    redirectTo: 'rest',
    pathMatch: 'full',
  },
  {
    path: 'rest',
    title: 'Rest',
    canDeactivate: [sidebarGuard],
    loadComponent: () => import('./components/board/board.component').then((c) => c.BoardComponent),
    providers: [
      { provide: AbstractTaskService, useExisting: TaskService },
      {
        provide: FORM_TOKEN,
        useValue: () =>
          import('@components/board/task-card/task-form/task-form.component').then(
            (a) => a.TaskFormComponent,
          ),
      },
    ],
  },
  {
    path: 'users',
    title: 'Users',
    loadComponent: () => import('./components/users/users.component').then((m) => m.UsersComponent),
    canActivate: [loginGuard],
    providers: [
      {
        provide: FORM_TOKEN,
        useValue: () =>
          import('@components/user-form/user-form.component').then((a) => a.UserFormComponent),
      },
    ],
  },

  {
    path: 'graphql',
    title: 'Graphql',
    canDeactivate: [sidebarGuard],
    loadComponent: () => import('./components/board/board.component').then((c) => c.BoardComponent),
    providers: [
      { provide: AbstractTaskService, useExisting: TaskGraphQlService },
      {
        provide: FORM_TOKEN,
        useValue: () =>
          import('@components/board/task-card/task-form/task-form.component').then(
            (a) => a.TaskFormComponent,
          ),
      },
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
