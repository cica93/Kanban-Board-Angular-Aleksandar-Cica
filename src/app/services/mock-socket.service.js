import { SocketService } from './socket.service';
export class SocketServiceMock {
    connect = jasmine.createSpy('connect');
    sendMessage = jasmine.createSpy('sendMessage');
}
export function provideSocketMock() {
    return { provide: SocketService, useClass: SocketServiceMock };
}
//# sourceMappingURL=mock-socket.service.js.map