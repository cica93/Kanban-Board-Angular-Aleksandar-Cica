import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarWrapperComponent } from './sidebar-wrapper.component';

describe('SidebarWrapperComponent', () => {
  let component: SidebarWrapperComponent;
  let fixture: ComponentFixture<SidebarWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarWrapperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
