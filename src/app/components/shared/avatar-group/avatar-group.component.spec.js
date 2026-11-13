import { TestBed } from '@angular/core/testing';
import { AvatarGroupComponent } from './avatar-group.component';
describe('AvatarGroupComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarGroupComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(AvatarGroupComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=avatar-group.component.spec.js.map