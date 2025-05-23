import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageHandlerService } from './services/message.handler.service';
import { SecurityService } from './services/security.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'apollo-angular';
import { User } from './services/user.service';
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, ToastModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "kanban-board-angular";
  user$!: Observable<User | null>;
  securityService = inject(SecurityService);
  messageService = inject(MessageService);
  messageHandler = inject(MessageHandlerService);
  subscription: Subscription | undefined;

  ngOnInit(): void {
    this.user$ = this.securityService.user$;
    this.messageHandler.errorEvent
      .asObservable()
      .subscribe(({ summary, detail }) => {
        this.messageService.add({
          severity: "error",
          key: "main",
          closable: true,
          summary,
          detail,
        });
      });
  }
}
