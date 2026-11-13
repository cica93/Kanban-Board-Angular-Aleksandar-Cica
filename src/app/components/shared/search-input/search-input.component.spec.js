import { TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
describe('SearchInputComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchInputComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(SearchInputComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=search-input.component.spec.js.map