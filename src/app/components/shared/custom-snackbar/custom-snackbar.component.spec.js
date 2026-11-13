import { TestBed } from '@angular/core/testing';
import { CustomSnackbarComponent } from './custom-snackbar.component';
describe('CustomSnackbarComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomSnackbarComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(CustomSnackbarComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=custom-snackbar.component.spec.js.map