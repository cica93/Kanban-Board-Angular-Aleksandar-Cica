import { Provider } from "@angular/core";
import { JwtService } from "./jwt.service";

export class MockJwtService {
  isTokenValid = jasmine.createSpy('isTokenValid').and.returnValue(true);
}

export function provideMockJwtService(): Provider {
  return { provide: JwtService, useValue: MockJwtService }
}
