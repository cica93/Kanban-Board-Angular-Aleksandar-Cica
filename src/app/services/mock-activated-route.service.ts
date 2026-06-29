import { Provider } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs"

export class MockActivatedRoute  {
    params = of({});
    queryParams = of({});
    data = of({});
    snapshot = {
        params: {},
        queryParams: {},
        data: {},
    };
};

export function provideMockActivatedRoute(): Provider {
    return { provide: ActivatedRoute, useClass: MockActivatedRoute };
}
