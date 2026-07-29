import { Provider } from "@angular/core";
import { SocketService } from './socket.service';

export class SocketServiceMock  {
  connect = jasmine.createSpy('connect');
  sendMessage = jasmine.createSpy('sendMessage');
}

export function provideSocketMock(): Provider {
  return { provide: SocketService, useClass: SocketServiceMock };
}
