import { Component, inject, resource, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { firstValueFrom } from 'rxjs';
import { AutoFocusModule } from 'primeng/autofocus';
import {
  form,
  required,
  email,
  minLength,
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

export interface LoginForm {
  email: string;
  password: string;
}

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
  protected model = signal<LoginForm>({ email: '', password: '' });
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly securityService = inject(SecurityService);
  private readonly userService = inject(UserService);
  protected loginForm = form<LoginForm>(
    this.model,
    (path) => {
      required(path.email, { message: 'Email is required' });
      email(path.email, { message: 'Please enter a valid email address' });
      required(path.password, { message: 'Password is required' });
      minLength(path.password, 8, {
        message: 'Password must be at least 8 characters long',
      });

      validate(path.password, ({ value }) => {
        const password = value() as string;
        if (!/[0-9]/.test(password)) {
          return this.createErrorObject(
            'Password must contain at least one number',
          );
        }
        if (!/[a-z]/.test(password)) {
          return this.createErrorObject(
            'Password must contain at least one lowercase letter',
          );
        }

        if (!/[A-Z]/.test(password)) {
          return this.createErrorObject(
            'Password must contain at least one uppercase letter',
          );
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
          return this.createErrorObject(
            'Password must contain at least one special character',
          );
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
