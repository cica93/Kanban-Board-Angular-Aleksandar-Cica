import { Injectable, signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

export interface SocketMessage {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$!: WebSocketSubject<SocketMessage>;

  connected = signal(false);

  connect(): void {
    this.socket$ = webSocket<SocketMessage>({
      url: 'ws://localhost:8080',
    });

    this.connected.set(true);
  }

  messages(): Observable<SocketMessage> {
    return this.socket$.asObservable();
  }

  send(message: SocketMessage): void {
    this.socket$.next(message);
  }

  disconnect(): void {
    this.socket$.complete();
    this.connected.set(false);
  }
}
