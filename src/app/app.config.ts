import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { routes } from './app.routes';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { appStore } from './store/store';
import { DialogService } from 'primeng/dynamicdialog';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { provideSignalFormsConfig } from '@angular/forms/signals';

const apiInterceptor = ApiInterceptor;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling(),
      withRouterConfig({ urlUpdateStrategy: 'deferred' }),
    ),
    provideSignalFormsConfig({
      classes: {
        'invalid-input': ({ state }) => state().invalid() && state().touched(),
        'valid-input': ({ state }) => state().valid(),
        'touched-input': ({ state }) => state().touched(),
        'pending-input': ({ state }) => state().pending(),
      },
    }),
    provideZoneChangeDetection(),
    Title,
    DialogService,
    { provide: TitleStrategy, useClass: KanbanTitle },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    MessageService,
    Apollo,
    provideStore(appStore),
    provideAnimations(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.p-dark' } },
    }),

    provideHttpClient(withXhr(), withInterceptors([apiInterceptor])),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => ({
        link: httpLink.create({ uri: 'http://localhost:3033/graphql' }),
        cache: new InMemoryCache({ resultCaching: false }),
      }),
      deps: [HttpLink],
    },
    provideAppInitializer(() => {
      const jwtService = inject(JwtService);
      const securityService = inject(SecurityService);
      if (!jwtService.isTokenValid()) {
        securityService.logout();
        return EMPTY;
      }
      return securityService.getCurrentUser();
    }),
    provideAnimationsAsync(),
  ],
};
