import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { JwtService } from './jwt.service';
import { MessageHandlerService } from './message.handler.service';
import { Task } from './abstract.task.service';
import { User } from './user.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private client!: Client;
  private readonly jwtService = inject(JwtService);
  private readonly messageHandler = inject(MessageHandlerService);

  connect(user: User | null) {
    if (this.client?.active || !user) {
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
          const task = JSON.parse(msg.body);
          if (this.isTask(task)) {
            if (
              (user.email !== task.createdBy && task.version === 0) ||
              (user.email !== task.updatedBy && task.version > 0)
            )
              this.messageHandler.successEvent.next({
                detail: this.createMessage(task),
                summary: 'New Changes',
                life: 5000,
              });
          }
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

  private isTask(task: any): task is Task {
    return !!task && typeof task === 'object' && 'version' in task && task.id;
  }

  private createMessage(task: Task): string {
    if (task.version === 0) {
      return 'New task is created by ' + task.createdBy;
    }
    return 'Task with id: ' + task.id + ' is updated by ' + task.updatedBy;
  }
}
