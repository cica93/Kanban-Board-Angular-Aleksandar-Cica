import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGroupComponent } from './link-group.component';

describe('LinkGroupComponent', () => {
  let component: LinkGroupComponent;
  let fixture: ComponentFixture<LinkGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkGroupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
