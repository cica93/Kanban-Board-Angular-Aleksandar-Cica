import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from 'src/app/services/login.service';
import { provideSecurityService } from 'src/app/services/mock-security.service';
import { provideMockUserService } from 'src/app/services/mock-user.service';
import { By } from '@angular/platform-browser';
import { provideMockJwtService } from 'src/app/services/mock-jwt.service';
import { provideMockRouter } from 'src/app/services/mock-router.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideSecurityService(),
        provideMockUserService(),
        LoginService,
        provideMockRouter(),
        provideMockJwtService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function submitButtonClick() {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement).toBeTruthy();
    button.nativeElement.click();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should focus email when is invalid', fakeAsync(() => {
    const email = fixture.debugElement.query(By.css('#email'));
    const form = component['loginForm']();
    spyOn(form, 'markAsTouched');
    spyOn(form, 'focusBoundControl');
    expect(email).toBeTruthy();
    submitButtonClick();
    expect(form.markAsTouched).toHaveBeenCalled();
    expect(form.focusBoundControl).toHaveBeenCalled();
    tick();
    expect(email.nativeElement === document.activeElement).toBeTrue();
  }));
});
