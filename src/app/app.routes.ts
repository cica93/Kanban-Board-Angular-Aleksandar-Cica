import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { SecurityService } from './services/security.service';
import { TaskService } from './services/task.service';
import { TaskGraphQlService } from './services/task.graphql.service';
import { AbstractTaskService } from './services/abstract.task.service';
import { User } from './services/user.service';
import { BoardComponent } from './components/board/board.component';

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

const logoutGuard = () => {
  const router = inject(Router);
  return inject(SecurityService).user$.pipe(
    map((user: User | null) => {
      if (user) {
        router.navigate(['/rest']);
        return false;
      }
      return true;
    })
  );
};

export const routes: Routes = [
  {
    path: 'rest',
    title: 'Rest',
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
  },
  {
    path: 'user-dialog',
    outlet: 'sidebar',
    loadComponent: () =>
      import(
        './components/board/task-card/task-dialog/task-dialog.component'
      ).then((c) => c.TaskDialogComponent),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: '',
    title: 'Rest',
    loadComponent: () =>
      import('./components/board/board.component').then(
        (c) => c.BoardComponent
      ),
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: 'graphql',
    title: 'Graphql',
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
    title: 'Login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
    canActivate: [logoutGuard],
  },
];
