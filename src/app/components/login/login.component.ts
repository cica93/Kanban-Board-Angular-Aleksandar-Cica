import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { Password, PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { JwtService } from '../../services/jwt.service';
import { User } from '../../services/user.service';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Button,
    PasswordModule,
    InputTextModule
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy   {

  form!: FormGroup;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  private jwtService = inject(JwtService);
  private subscription: Subscription | undefined;

  @ViewChild('passwordInput') passwordInput!: Password;

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]],
    });
  }

  ngAfterViewInit(): void {
    this.subscription = fromEvent(this.passwordInput.input.nativeElement, 'keyup')  
      .subscribe((event: any) => {
         if (event.key === 'Enter') { 
            this.login();
          }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  login(): void {
    this.loginService.login(this.form.value).subscribe({
      next: (user: User) => {
       this.jwtService.saveToken(user.token);
       this.securityService.user$.next(user);
      this.router.navigate(['rest']);
    }})
  }

}
