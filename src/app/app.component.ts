import { Component, inject, injectAsync, OnInit, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '@service/user.service';
import { BaseDialogComponent } from './components/shared/base-dialog/base-dialog.component';
import { MessageHandlerService } from '@service/message.handler.service';
import { SecurityService } from '@service/security.service';
import { SocketService } from '@service/socket.service';

import { logOutOutline } from 'ionicons/icons';
import { SidebarComponent } from '@components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  logOutOutlineIcon = logOutOutline;
  protected user$!: Observable<User | null>;
  private readonly securityService = inject(SecurityService);
  private readonly toastController = injectAsync(() =>
    import('@ionic/angular').then((a) => a.ToastController),
  );
  private readonly socket = inject(SocketService);
  private readonly messageHandlerService = inject(MessageHandlerService);
  public showDialog = signal(false);
  protected modalHeader = signal('');

  baseDialog = viewChild(BaseDialogComponent);

  ngOnInit(): void {
    this.user$ = this.securityService.user$.asObservable().pipe(
      tap((user) => {
        this.socket.connect(user);
      }),
    );

    this.messageHandlerService.errorEvent.asObservable().subscribe(({ summary, detail, life }) => {
      this.showMessage(summary ?? '', detail, life, 'danger');
    });

    this.messageHandlerService.successEvent
      .asObservable()
      .subscribe(({ summary, detail, life }) => {
        this.showMessage(summary ?? '', detail, life, 'success');
      });
  }

  logout(): void {
    this.securityService.logout();
  }

  private async showMessage(
    summary: string,
    detail: string | undefined,
    duration: number | undefined,
    color: 'danger' | 'success',
  ) {
    const toast = await (
      await this.toastController()
    ).create({
      header: detail,
      message: summary,
      duration: duration ?? 3000,
      position: 'top',
      color,
    });

    await toast.present();
  }
}
