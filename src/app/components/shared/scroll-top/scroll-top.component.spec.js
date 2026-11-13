import { TestBed } from '@angular/core/testing';
import { ScrollTopComponent } from './scroll-top.component';
describe('ScrollTopComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ScrollTopComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(ScrollTopComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=scroll-top.component.spec.js.map