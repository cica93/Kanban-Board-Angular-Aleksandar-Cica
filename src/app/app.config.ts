import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { EMPTY } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { JwtService } from './services/jwt.service';
import { SecurityService } from './services/security.service';

import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { Title } from '@angular/platform-browser';
import { KanbanTitle } from './services/kanban.title.service';
import { GlobalErrorHandler } from './services/error.handler.service';

export function initAuth(
  jwtService: JwtService,
  securityService: SecurityService
) {
  if (!jwtService.isTokenValid()) {
    securityService.logout();
    return () => EMPTY;
  }
  return () => securityService.getCurrentUser();
}

const apiInterceptor = ApiInterceptor;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling(),
      withRouterConfig({ urlUpdateStrategy: 'deferred' })
    ),
    Title,
    { provide: TitleStrategy, useClass: KanbanTitle },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    MessageService,
    Apollo,
    provideAnimations(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.p-dark' } },
    }),

    provideHttpClient(withInterceptors([apiInterceptor])),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => ({
        link: httpLink.create({ uri: 'http://localhost:3033/graphql' }), // <-- Your GraphQL API
        cache: new InMemoryCache({ resultCaching: false }),
      }),
      deps: [HttpLink],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [JwtService, SecurityService],
      multi: true,
    },
  ],
};
