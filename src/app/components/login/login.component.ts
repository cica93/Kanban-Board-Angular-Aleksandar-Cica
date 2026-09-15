import { Component, injectAsync, resource, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import {
  IonButton,
  IonSpinner,
  IonInput,
  IonItem,
  IonList,
  IonInputPasswordToggle,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular';
import {
  form,
  required,
  email,
  validate,
  FormField,
  FormRoot,
  validateAsync,
} from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { JwtUtils } from '@service/jwt.service';
import { User } from '@service/user.service';

declare const __brand: unique symbol;
type Branded<T, BRAND> = T & { [__brand]: BRAND };
export type Email = Branded<string, 'Email'>;
export type Password = Branded<string, 'password'>;

export interface LoginForm {
  email: string;
  password: string;
}

export interface BaseMessage {
  id: number;
  email: string;
}

export type Data<T> = {
  data: T[];
  error?: never;
};

export type Error = {
  error: string;
  data?: never;
};

export type DataStatus<T = any> = { http: string } & (Data<T> | Error);

export function isError<T = any>(d: DataStatus<T>): d is { http: string } & Error {
  return 'error' in d;
}

export function some<T = any>(d: DataStatus<T>): void {
  if (isError(d)) {
    d.error;
  } else {
    d.data;
  }
}

export function assertValidEmail(email: string): asserts email is Email {
  if (!email.includes('@')) {
    throw new Error('not valid email');
  }
}

export function checkEmail(email: string): Email {
  assertValidEmail(email);
  return email as Email;
}

export type Measure = 'px' | 'rem' | 'vh' | 'vw' | '%';
export type PositiveCssSize<S extends string = 'string'> = S extends `-${string}`
  ? never
  : S extends `${number}${Measure}`
    ? S
    : never;

export function setElementWidth<T extends HTMLElement, S extends string>(
  element: T,
  cssSize: PositiveCssSize<S>,
): void {
  element.style.width = cssSize;
}

export type ObservableType<T> = T extends (...args: any) => Observable<infer R> ? R : never;

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    FormRoot,
    FormsModule,
    IonButton,
    IonItem,
    IonList,
    IonInputPasswordToggle,
    IonSpinner,
    IonInput,
    IonCol,
    IonGrid,
    IonRow,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly loginService = injectAsync(() =>
    import('@service/login.service').then((m) => m.LoginService),
  );
  private readonly router = injectAsync(() => import('@angular/router').then((r) => r.Router));
  private readonly securityService = injectAsync(() =>
    import('@service/security.service').then((s) => s.SecurityService),
  );
  private readonly userService = injectAsync(() =>
    import('@service/user.service').then((u) => u.UserService),
  );
  protected model = signal<Pick<User, 'email' | 'password'>>({
    email: '',
    password: '',
  });

  email = signal('');
  hidePassword = signal(true);

  protected loginForm = form<Pick<User, 'email' | 'password'>>(
    this.model,
    (path) => {
      required(path.email, { message: 'Email is required' });
      email(path.email, { message: 'Please enter a valid email address' });
      validate(path.password, ({ value }) => {
        const message = passwordErrorMessage(value());
        if (message) {
          return this.createErrorObject(message);
        }
        return undefined;
      });
      validateAsync(path.email, {
        params: ({ value }) => value(),
        debounce: 300,
        factory: (emailValue) =>
          resource({
            params: emailValue,
            loader: async ({ params }) => {
              const userService = await this.userService();
              return firstValueFrom(userService.hasMail(params));
            },
          }),
        onSuccess: (hasMail, ctx) =>
          !hasMail
            ? this.createErrorObject(
                `Email ${ctx.value()} is not registered`,
                'email-not-registered',
              )
            : undefined,
        onError: (_error, _ctx) => {
          return undefined;
        },
      });
    },
    {
      submission: {
        action: async () => {
          try {
            const [router, securityService, loginService] = await Promise.all([
              this.router(),
              this.securityService(),
              this.loginService(),
            ]);
            const response = await firstValueFrom(loginService.login(this.loginForm().value()));
            JwtUtils.saveToken(response.token);
            securityService.user$.next(response);
            router.navigate(['/rest']);
            return undefined;
          } catch (error) {
            return this.createErrorObject('Invalid email or password', 'invalid-credentials');
          }
        },
        onInvalid: () => {
          this.loginForm().markAsTouched();
          this.loginForm().focusBoundControl();
        },
        ignoreValidators: 'pending',
      },
    },
  );

  private createErrorObject(
    message: string,
    kind = 'wrong-format',
  ): {
    message: string;
    kind: string;
  } {
    return { kind, message };
  }
}

export const MIN_PASSWORD_LENGTH = 8;

export function passwordErrorMessage(password?: string | null): string | null {
  if (!password) {
    return 'Password is not provided';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    ('Password must contain at least one uppercase letter');
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `password have to have the least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

export function isPassword(password?: string | null): password is Password {
  return !passwordErrorMessage(password);
}

export function brand<T, B>(value: T): Branded<T, B> {
  return value as Branded<T, B>;
}
