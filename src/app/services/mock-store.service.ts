import { Provider } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

export class MockStore {
  select = jasmine.createSpy().and.returnValue(
    of({
      items: [],
      loading: false,
    }),
  );
}

export function provideMockStore(): Provider {
  return { provide: Store, useClass: MockStore }
}
