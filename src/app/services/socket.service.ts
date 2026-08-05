import { Injectable, inject } from '@angular/core';
import { MessageHandlerService } from './message.handler.service';
import { Task } from './abstract.task.service';
import { User } from './user.service';
import { JwtUtils } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: WebSocket;
  private readonly messageHandler = inject(MessageHandlerService);

  connect(user: User | null): void {
    if (!user || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = JwtUtils.getToken();
    if (!token) {
      console.warn('[SocketService] Cannot connect: no JWT token found.');
      return;
    }

    this.socket = new WebSocket('ws://localhost:3033/ws');

    this.socket.onopen = () => {
      console.log('WS CONNECTED');
    };

    this.socket.onmessage = (event) => {
      console.log('[SocketService] Raw event data:', event.data);
      try {
        const message = JSON.parse(event.data);
        const task = message?.entity;
        if (this.isTask(task)) {
          const isNewTask = message?.type === 'CREATED';
          const isUpdatedTask = message?.type === 'UPDATED';
          const shouldNotify =
            (user?.email !== task.createdBy && isNewTask) ||
            (user?.email !== task.updatedBy && isUpdatedTask);

          if (shouldNotify || true) {
            this.messageHandler.successEvent.next({
              detail: this.createMessage(task, message?.type),
              summary: isUpdatedTask ? 'Task updated' : 'New task created',
              life: 5000,
            });
          }
        }
      } catch (error) {
        console.error(
          '[SocketService] Failed to parse websocket message',
          error,
        );
      }
    };

    this.socket.onerror = (error) => {
      console.error('WS ERROR', error);
    };

    this.socket.onclose = () => {
      console.log('WS CLOSED');
      this.socket = undefined;
    };
  }

  sendMessage(msg: string) {
    this.socket?.send(msg);
  }

  private isTask(task: any): task is Task {
    return !!task && typeof task === 'object' && 'version' in task && task.id;
  }

  private createMessage(task: Task, eventType?: string): string {
    if (eventType === 'CREATED' || task.version === 0) {
      return 'New task created by ' + task.createdBy;
    }
    return 'Task with id ' + task.id + ' was updated by ' + task.updatedBy;
  }
}
