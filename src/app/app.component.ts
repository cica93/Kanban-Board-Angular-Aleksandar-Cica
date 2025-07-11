import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageHandlerService } from './services/message.handler.service';
import { SecurityService } from './services/security.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'apollo-angular';
import { User } from './services/user.service';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TaskDialogComponent } from './components/board/task-card/task-dialog/task-dialog.component';
import { BaseDialogComponent } from './components/base-dialog/base-dialog.component';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'kanban-board-angular';
  user$!: Observable<User | null>;
  securityService = inject(SecurityService);
  messageService = inject(MessageService);
  messageHandler = inject(MessageHandlerService);
  subscription: Subscription | undefined;
  router = inject(Router);
  showDialog = signal(false);
  modalHeader = signal<string>('');

  ngOnInit(): void {
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
    this.modalHeader.set(event.getModalHeader());
  }
}
