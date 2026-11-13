import { __decorate } from "tslib";
import { Injectable, signal } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
let WebsocketService = class WebsocketService {
    socket$;
    connected = signal(false);
    connect() {
        this.socket$ = webSocket({
            url: 'ws://localhost:8080',
        });
        this.connected.set(true);
    }
    messages() {
        return this.socket$.asObservable();
    }
    send(message) {
        this.socket$.next(message);
    }
    disconnect() {
        this.socket$.complete();
        this.connected.set(false);
    }
};
WebsocketService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], WebsocketService);
export { WebsocketService };
//# sourceMappingURL=websocket.service.js.map