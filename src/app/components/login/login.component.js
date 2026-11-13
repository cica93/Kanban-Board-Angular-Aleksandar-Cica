import { __decorate } from "tslib";
import { Component, injectAsync, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IonButton, IonSpinner, IonInput, IonItem, IonList, IonInputPasswordToggle, IonCol, IonGrid, IonRow, } from '@ionic/angular';
import { form, required, email, validate, FormField, FormRoot, validateAsync, } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { JwtUtils } from '@service/jwt.service';
export function isError(d) {
    return 'error' in d;
}
export function some(d) {
    if (isError(d)) {
        d.error;
    }
    else {
        d.data;
    }
}
export function assertValidEmail(email) {
    if (!email.includes('@')) {
        throw new Error('not valid email');
    }
}
export function checkEmail(email) {
    assertValidEmail(email);
    return email;
}
export function setElementWidth(element, cssSize) {
    element.style.width = cssSize;
}
let LoginComponent = class LoginComponent {
    loginService = injectAsync(() => import('@service/login.service').then((m) => m.LoginService));
    router = injectAsync(() => import('@angular/router').then((r) => r.Router));
    securityService = injectAsync(() => import('@service/security.service').then((s) => s.SecurityService));
    userService = injectAsync(() => import('@service/user.service').then((u) => u.UserService));
    model = signal({
        email: '',
        password: '',
    });
    email = signal('');
    hidePassword = signal(true);
    loginForm = form(this.model, (path) => {
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
            factory: (emailValue) => resource({
                params: emailValue,
                loader: async ({ params }) => {
                    const userService = await this.userService();
                    return firstValueFrom(userService.hasMail(params));
                },
            }),
            onSuccess: (hasMail, ctx) => !hasMail
                ? this.createErrorObject(`Email ${ctx.value()} is not registered`, 'email-not-registered')
                : undefined,
            onError: (_error, _ctx) => {
                return undefined;
            },
        });
    }, {
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
                }
                catch (error) {
                    return this.createErrorObject('Invalid email or password', 'invalid-credentials');
                }
            },
            onInvalid: () => {
                this.loginForm().markAsTouched();
                this.loginForm().focusBoundControl();
            },
            ignoreValidators: 'pending',
        },
    });
    createErrorObject(message, kind = 'wrong-format') {
        return { kind, message };
    }
};
LoginComponent = __decorate([
    Component({
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
], LoginComponent);
export { LoginComponent };
export const MIN_PASSWORD_LENGTH = 8;
export function passwordErrorMessage(password) {
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
export function isPassword(password) {
    return !passwordErrorMessage(password);
}
export function brand(value) {
    return value;
}
//# sourceMappingURL=login.component.js.map