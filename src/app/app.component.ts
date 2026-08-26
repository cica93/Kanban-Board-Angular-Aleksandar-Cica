import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { User } from '@service/user.service';
import { BaseDialogComponent } from './components/shared/base-dialog/base-dialog.component';
import { LinkGroupComponent } from '@components/shared/link-group/link-group.component';
import { MessageHandlerService } from '@service/message.handler.service';
import { SecurityService } from '@service/security.service';
import { SocketService } from '@service/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '@components/shared/custom-snackbar/custom-snackbar.component';
import { AvatarComponent } from '@components/shared/avatar/avatar.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
    SlicePipe,
    LinkGroupComponent,
    AvatarComponent,
    MatTooltip,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  protected user$!: Observable<User | null>;
  private readonly securityService = inject(SecurityService);
  private readonly snackBar = inject(MatSnackBar);
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

    this.messageHandlerService.errorEvent
      .asObservable()
      .subscribe(({ summary, detail, life }) => {
        this.showMessage(summary, detail, life, 'error');
      });

    this.messageHandlerService.successEvent
      .asObservable()
      .subscribe(({ summary, detail, life }) => {
        this.showMessage(summary, detail, life, 'success');
      });
  }

  logout(): void {
    this.securityService.logout();
  }

  private showMessage(
    summary: string | undefined,
    detail: string | undefined,
    life: number | undefined,
    type: 'error' | 'success',
  ) {
    if (summary && detail) {
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: life ?? 3000,
        panelClass: [type === 'success' ? 'success-snack' : 'error-snack'],
        data: {
          summary,
          detail,
        },
      });
    }
  }
}
