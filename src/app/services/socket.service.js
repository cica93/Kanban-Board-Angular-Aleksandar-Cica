import { __decorate } from "tslib";
import { Injectable, inject } from '@angular/core';
import { JwtUtils } from '@service/jwt.service';
import { MessageHandlerService } from './message.handler.service';
let SocketService = class SocketService {
    socket;
    messageHandlerService = inject(MessageHandlerService);
    connect(user) {
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
                    const shouldNotify = (user?.email !== task.createdBy && isNewTask) ||
                        (user?.email !== task.updatedBy && isUpdatedTask);
                    if (shouldNotify) {
                        this.messageHandlerService.successEvent.next({
                            detail: this.createMessage(task, message?.type),
                            summary: isUpdatedTask ? 'Task updated' : 'New task created',
                            life: 5000,
                        });
                    }
                }
            }
            catch (error) {
                console.error('[SocketService] Failed to parse websocket message', error);
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
    sendMessage(msg) {
        this.socket?.send(msg);
    }
    isTask(task) {
        return !!task && typeof task === 'object' && 'version' in task && task.id;
    }
    createMessage(task, eventType) {
        if (eventType === 'CREATED' || task.version === 0) {
            return 'New task created by ' + task.createdBy;
        }
        return 'Task with id ' + task.id + ' was updated by ' + task.updatedBy;
    }
};
SocketService = __decorate([
    Injectable({ providedIn: 'root' })
], SocketService);
export { SocketService };
//# sourceMappingURL=socket.service.js.map