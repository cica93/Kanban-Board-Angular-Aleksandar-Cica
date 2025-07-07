import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SecurityService } from './services/security.service';
import { TaskService } from './services/task.service';
import { TaskGraphQlService } from './services/task.graphql.service';
import { AbstractTaskService } from './services/abstract.task.service';
import { User } from './services/user.service';

const loginGuard = () => {
  const security = inject(SecurityService);
  return inject(SecurityService).user$.pipe(
    map((user: User | null) => {
      if (!user) {
        security.logout();
        return false;
      }
      return true;
    })
  );
};

export const routes: Routes = [
  {
    path: 'rest',
    title: 'Board Rest',
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: '',
    title: 'Board Rest',
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: 'graphql',
    title: 'Board Graphql',
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent
      ),
    providers: [
      { provide: AbstractTaskService, useExisting: TaskGraphQlService },
    ],
    canActivate: [loginGuard],
  },
  {
    path: 'login',
    title: 'Board',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
];
