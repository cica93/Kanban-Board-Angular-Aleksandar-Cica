import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
export class MockActivatedRoute {
    params = of({});
    queryParams = of({});
    data = of({});
    snapshot = {
        params: {},
        queryParams: {},
        data: {},
    };
}
export function provideMockActivatedRoute() {
    return { provide: ActivatedRoute, useClass: MockActivatedRoute };
}
//# sourceMappingURL=mock-activated-route.service.js.map