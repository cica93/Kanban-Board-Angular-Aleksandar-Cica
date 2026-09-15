import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '@service/login.service';
import { provideSecurityService } from '@service/mock-security.service';
import { provideMockUserService } from '@service/mock-user.service';
import { By } from '@angular/platform-browser';
import { provideMockRouter } from '@service/mock-router.service';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideSecurityService(),
        provideMockUserService(),
        LoginService,
        provideMockRouter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  function submitButtonClick() {
    const button = el.query(By.css('button'));
    expect(button.nativeElement).toBeTruthy();
    button.nativeElement.click();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should focus email when is invalid', fakeAsync(() => {
    const email = el.query(By.css('#email'));
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
