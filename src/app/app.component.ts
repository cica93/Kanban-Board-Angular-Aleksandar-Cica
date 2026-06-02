import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageHandlerService } from './services/message.handler.service';
import { SecurityService } from './services/security.service';
import { JwtService } from './services/jwt.service';
import { Observable } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { User } from './services/user.service';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { BaseDialogComponent } from './components/base-dialog/base-dialog.component';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    ToastModule,
    RouterLink,
    RouterLinkActive,
    TooltipModule,
    DialogModule,
    TitleCasePipe,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'kanban-board-angular';
  user$!: Observable<User | null>;
  private readonly securityService = inject(SecurityService);
  private readonly jwtService = inject(JwtService);
  private readonly messageService = inject(MessageService);
  private readonly messageHandler = inject(MessageHandlerService);
  private readonly socket = inject(SocketService);
  private readonly router = inject(Router);
  protected showDialog = signal(false);
  protected modalHeader?: Observable<string>;

  ngOnInit(): void {
    if (this.jwtService.isTokenValid()) {
      this.socket.connect();
    }

    this.securityService.user$
      .asObservable()
      .subscribe((user) => {
        if (user) {
          this.socket.connect();
        }
      });

    this.user$ = this.securityService.user$;
    this.messageHandler.errorEvent
      .asObservable()
      .subscribe(({ summary, detail }) => {
        if (summary && detail) {
          this.messageService.add({
            severity: 'error',
            key: 'main',
            closable: true,
            summary,
            detail,
          });
        }
      });
    this.messageHandler.successEvent
      .asObservable()
      .subscribe(({ summary, detail }) => {
        if (summary && detail) {
          this.messageService.add({
            severity: 'success',
            key: 'main',
            closable: true,
            summary,
            detail,
          });
        }
      });
  }

  logout(): void {
    this.securityService.logout();
  }

  dialogVisibleChange(event: boolean): void {
    if (!event) {
      this.router.navigate([{ outlets: { sidebar: null } }], {
        state: { initNewSearch: false },
      });
    }
  }

  onSidebarActivate(event: BaseDialogComponent): void {
    this.showDialog.set(true);
    this.modalHeader = event.modalHeader.asObservable();
  }
}
