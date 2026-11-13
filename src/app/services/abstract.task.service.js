import { Subject } from 'rxjs';
export const TASK_PRIORITIES = ['LOW', 'MED', 'HIGH'];
export const TASK_STATUSES = ['TO DO', 'IN PROGRESS', 'DONE'];
export const TASK_STATUSES_OPTIONS = TASK_STATUSES.map((ts) => ({
    value: ts.replace(' ', '_'),
    label: ts,
}));
const BADGE_COLORS = ['success', 'warning', 'danger'];
export const BADGE_COLOR_MAP = Object.fromEntries(TASK_PRIORITIES.map((priority, index) => [priority, BADGE_COLORS[index]]));
export class AbstractTaskService {
    taskChange = new Subject();
}
//# sourceMappingURL=abstract.task.service.js.map