import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { LoginComponent } from './components/login/login.component';
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
    component: BoardComponent,
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: '',
    title: 'Board Rest',
    component: BoardComponent,
    providers: [{ provide: AbstractTaskService, useExisting: TaskService }],
    canActivate: [loginGuard],
  },
  {
    path: 'graphql',
    title: 'Board Graphql',
    component: BoardComponent,
    providers: [
      { provide: AbstractTaskService, useExisting: TaskGraphQlService },
    ],
    canActivate: [loginGuard],
  },
  {
    path: 'login',
    title: 'Board',
    component: LoginComponent,
  },
];
