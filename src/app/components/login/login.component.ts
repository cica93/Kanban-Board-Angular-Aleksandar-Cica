import { Component, inject, resource, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom, Observable } from 'rxjs';
import { AutoFocusModule } from 'primeng/autofocus';
import {
  form,
  required,
  email,
  validate,
  FormField,
  FormRoot,
  validateAsync,
} from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { FormValueWrapperComponent } from 'src/app/form-value-wrapper/form-value-wrapper.component';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '@service/login.service';
import { SecurityService } from '@service/security.service';
import { UserService } from '@service/user.service';
import { JwtUtils } from '@service/jwt.service';

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

export function isError<T = any>(
  d: DataStatus<T>,
): d is { http: string } & Error {
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
export type PositiveCssSize<S extends string = 'string'> =
  S extends `-${string}` ? never : S extends `${number}${Measure}` ? S : never;

export function setElementWidth<T extends HTMLElement, S extends string>(
  element: T,
  cssSize: PositiveCssSize<S>,
): void {
  element.style.width = cssSize;
}

export type ObservableType<T> = T extends (...args: any) => Observable<infer R>
  ? R
  : never;

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    InputTextModule,
    AutoFocusModule,
    FormField,
    FormRoot,
    FormValueWrapperComponent,
    PasswordModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly securityService = inject(SecurityService);
  private readonly userService = inject(UserService);
  protected model = signal<LoginForm>({
    email: '',
    password: '',
  });

  email = signal('');

  protected loginForm = form<LoginForm>(
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
              if (!params) {
                return false;
              }
              return firstValueFrom(this.userService.hasMail(params));
            },
          }),
        onSuccess: (hasMail, ctx) =>
          !hasMail
            ? this.createErrorObject(
                `Email ${ctx.value()} is not registered`,
                'email-not-registered',
              )
            : undefined,
        onError: (_error, _ctx) => undefined,
      });
    },
    {
      submission: {
        action: async () => {
          try {
            const response = await firstValueFrom(
              this.loginService.login(this.loginForm().value()),
            );
            JwtUtils.saveToken(response.token);
            this.securityService.user$.next(response);
            this.router.navigate(['/rest']);
            return undefined;
          } catch (error) {
            return this.createErrorObject(
              'Invalid email or password',
              'invalid-credentials',
            );
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
