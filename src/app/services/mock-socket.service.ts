import { Provider } from "@angular/core";

export class SocketServiceMock  {
  connect = jasmine.createSpy('connect');
  sendMessage = jasmine.createSpy('sendMessage');
}

export function provideSocketMock(): Provider {
  return { provide: SocketServiceMock, useClass: SocketServiceMock };
}
