import { TestBed } from '@angular/core/testing';
import { SetupComponent } from './setup.component';
describe('SetupComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SetupComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(SetupComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=setup.component.spec.js.map