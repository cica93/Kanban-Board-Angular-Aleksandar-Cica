import { __decorate } from "tslib";
import { Component, inject, injectAsync, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BaseDialogComponent } from './components/shared/base-dialog/base-dialog.component';
import { MessageHandlerService } from '@service/message.handler.service';
import { SecurityService } from '@service/security.service';
import { SocketService } from '@service/socket.service';
import { logOutOutline } from 'ionicons/icons';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
let AppComponent = class AppComponent {
    logOutOutlineIcon = logOutOutline;
    user$;
    securityService = inject(SecurityService);
    toastController = injectAsync(() => import('@ionic/angular').then((a) => a.ToastController));
    socket = inject(SocketService);
    messageHandlerService = inject(MessageHandlerService);
    showDialog = signal(false);
    modalHeader = signal('');
    baseDialog = viewChild(BaseDialogComponent);
    ngOnInit() {
        this.user$ = this.securityService.user$.asObservable().pipe(tap((user) => {
            this.socket.connect(user);
        }));
        this.messageHandlerService.errorEvent.asObservable().subscribe(({ summary, detail, life }) => {
            this.showMessage(summary ?? '', detail, life, 'danger');
        });
        this.messageHandlerService.successEvent
            .asObservable()
            .subscribe(({ summary, detail, life }) => {
            this.showMessage(summary ?? '', detail, life, 'success');
        });
    }
    logout() {
        this.securityService.logout();
    }
    async showMessage(summary, detail, duration, color) {
        const toast = await (await this.toastController()).create({
            header: detail,
            message: summary,
            duration: duration ?? 3000,
            position: 'top',
            color,
        });
        await toast.present();
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet, AsyncPipe, SidebarComponent],
        templateUrl: './app.component.html',
        styleUrl: './app.component.scss',
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map