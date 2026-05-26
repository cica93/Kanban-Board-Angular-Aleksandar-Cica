import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private client!: Client;

  connect() {
    this.client = new Client({
      brokerURL: 'ws://localhost:3033/ws',

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
