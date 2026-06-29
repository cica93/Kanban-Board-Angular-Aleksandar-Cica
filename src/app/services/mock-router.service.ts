import { Provider } from "@angular/core";
import { Router } from "@angular/router";
import { of, Subject } from "rxjs";

export class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(of({}));
  events = new Subject();
  url = '/';

  isActive() {
    return false;
  }
};

export function provideMockRouter(): Provider {
    return { provide: Router, useClass: MockRouter }
}
