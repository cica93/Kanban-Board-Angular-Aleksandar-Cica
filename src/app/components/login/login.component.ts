import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { SecurityService } from '../../services/security.service';
import { JwtService } from '../../services/jwt.service';
import { User } from '../../services/user.service';

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
export class LoginComponent implements OnInit  {
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private securityService = inject(SecurityService);
  private jwtService = inject(JwtService);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
    });
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
