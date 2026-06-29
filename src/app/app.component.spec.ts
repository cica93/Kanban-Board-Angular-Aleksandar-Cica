import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideSecurityService } from './services/mock-security.service';
import { provideRouter } from '@angular/router';
import { provideMockMessageHandler } from './services/mock-message-handler.service';
import { By } from '@angular/platform-browser';
import { provideSocketMock } from './services/mock-socket.service';
import { provideMockRouter } from './services/mock-router.service';
import { provideMockMessage } from './services/mock-message.service';
import { APP_INITIALIZER, NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { provideMockActivatedRoute } from './services/mock-activated-route.service';
import { SecurityService } from './services/security.service';
import { BaseDialogComponent } from './components/base-dialog/base-dialog.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let securityService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideMockRouter(),
        provideRouter([]),
        provideMockActivatedRoute(),
        provideAnimationsAsync(),
        provideAnimations(),
        provideMockMessage(),
        provideSocketMock(),
        provideSecurityService(),
        provideMockRouter(),
        provideMockMessageHandler(),
        {
          provide: APP_INITIALIZER,
          useValue: () => () =>
            of({
              id: 1,
              username: 'test',
            }),
          multi: true,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignoriše PrimeNG i template dependencies
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call logout when logout button is clicked', () => {
    const logoutButton = fixture.debugElement.query(By.css('#logout-icon'));
    expect(logoutButton).toBeTruthy();

    logoutButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    securityService = TestBed.inject(
      SecurityService,
    ) as jasmine.SpyObj<SecurityService>;
    expect(securityService.logout).toHaveBeenCalled();
  });

  it('should open modal', () => {
    const e = { modalHeader: new BehaviorSubject<string>('modalName') };
    fixture.componentInstance.onSidebarActivate(
      e as unknown as BaseDialogComponent,
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.showDialog()).toBe(true);
  });
});
