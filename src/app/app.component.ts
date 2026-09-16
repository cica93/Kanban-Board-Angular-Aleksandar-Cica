import { Component, inject, injectAsync, OnInit, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { User } from '@service/user.service';
import { BaseDialogComponent } from './components/shared/base-dialog/base-dialog.component';
import { LinkGroupComponent } from '@components/shared/link-group/link-group.component';
import { MessageHandlerService } from '@service/message.handler.service';
import { SecurityService } from '@service/security.service';
import { SocketService } from '@service/socket.service';
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRouterLink,
  IonRow,
} from '@ionic/angular';
import { logOutOutline } from 'ionicons/icons';
import { TooltipDirective } from './directives/tooltip.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe,
    RouterLink,
    TitleCasePipe,
    SlicePipe,
    LinkGroupComponent,
    IonAvatar,
    IonGrid,
    IonRow,
    IonIcon,
    IonCol,
    IonRouterLink,
    IonButton,
    IonHeader,
    RouterLinkActive,
    TooltipDirective,
  ],
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
