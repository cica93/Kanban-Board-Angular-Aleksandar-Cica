import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { JwtService } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private client!: Client;
  private readonly jwtService = inject(JwtService);

  connect() {
    if (this.client?.active) {
      return;
    }

    const token = this.jwtService.getToken();
    if (!token) {
      console.warn('[SocketService] Cannot connect: no JWT token found.');
      return;
    }

    this.client = new Client({
      brokerURL: 'ws://localhost:3033/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (msg) => console.log('[STOMP]', msg),
      onConnect: () => {
        console.log('CONNECTED');

        this.client.subscribe('/topic/updates', (msg) => {
          console.log('MESSAGE:', msg.body);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP ERROR', frame);
      },
      onWebSocketError: (err) => {
        console.error('WS ERROR', err);
      },
    });

    this.client.activate();
  }

  sendMessage(msg: string) {
    this.client.publish({
      destination: '/app/chat',
      body: msg,
    });
  }
}
