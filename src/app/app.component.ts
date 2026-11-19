import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { User } from '@service/user.service';
import { MessageHandlerService } from '@service/message.handler.service';
import { SecurityService } from '@service/security.service';
import { SocketService } from '@service/socket.service';

import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { ToastService } from 'cica-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected user$!: Observable<User | null>;
  private readonly securityService = inject(SecurityService);
  private readonly toastService = inject(ToastService);
  private readonly socket = inject(SocketService);
  private readonly messageHandlerService = inject(MessageHandlerService);
  public showDialog = signal(false);
  protected modalHeader = signal('');

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

  private showMessage(
    summary: string,
    detail: string | undefined,
    duration: number | undefined,
    color: 'danger' | 'success',
  ) {
    this.toastService.show(color === 'danger' ? 'error' : 'success', summary, detail, duration);
  }
}
