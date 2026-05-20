import { Component, inject, resource, signal } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { JwtService } from '../../services/jwt.service';
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
import { Button } from 'primeng/button';
import { UserService } from 'src/app/services/user.service';

export interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    Button,
    PasswordModule,
    InputTextModule,
    AutoFocusModule,
    FormField,
    FormRoot,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  private jwtService = inject(JwtService);
  private userService = inject(UserService);
  protected model = signal<LoginForm>({ email: '', password: '' });
  protected loginForm = form(
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
          return this.createErrorMessageObject(
            'Password must contain at least one number',
          );
        }
        if (!/[a-z]/.test(password)) {
          return this.createErrorMessageObject(
            'Password must contain at least one lowercase letter',
          );
        }

        if (!/[A-Z]/.test(password)) {
          return this.createErrorMessageObject(
            'Password must contain at least one uppercase letter',
          );
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
          return this.createErrorMessageObject(
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
            ? this.createErrorMessageObject(
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
            this.jwtService.saveToken(response.token);
            await firstValueFrom(this.securityService.getCurrentUser());
            this.router.navigate(['/']);
            return undefined;
          } catch (error) {
            return {
              kind: 'invalid-credentials',
              message: 'Invalid email or password',
            };
          }
        },
      },
    },
  );

  private createErrorMessageObject(
    message: string,
    kind = 'wrong-format',
  ): {
    message: string;
    kind: string;
  } {
    return { kind, message };
  }
}
