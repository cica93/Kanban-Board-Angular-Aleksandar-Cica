import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SecurityService } from './services/security.service';
import { TaskService } from './services/task.service';
import { TaskGraphQlService } from './services/task.graphql.service';
import { AbstractTaskService } from './services/abstract.task.service';
import { sidebarGuard } from './guards/sidebar.guard';

const loginGuard = () => {
  const security = inject(SecurityService);
  return inject(SecurityService).user$.pipe(
    map((user) => {
      if (!user) {
        security.logout();
        return false;
      }
      return true;
    }),
  );
};

const logoutGuard = () => {
  const router = inject(Router);
  return inject(SecurityService).user$.pipe(
    map((user) => {
      if (user) {
        router.navigate(['/rest']);
        return false;
      }
      return true;
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
