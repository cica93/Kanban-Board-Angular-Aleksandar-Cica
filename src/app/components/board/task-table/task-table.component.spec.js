import { TestBed } from '@angular/core/testing';
import { TaskTableComponent } from './task-table.component';
describe('TaskTableComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TaskTableComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(TaskTableComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=task-table.component.spec.js.map