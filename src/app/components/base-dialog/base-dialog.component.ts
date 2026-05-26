import { Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MessageHandlerService } from 'src/app/services/message.handler.service';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  template: '',
})
export abstract class BaseDialogComponent<T = any> implements OnInit {
  private readonly location = inject(Location);
  private readonly messageHandler = inject(MessageHandlerService);
  private readonly router = inject(Router);
  protected initValue = signal<T>({} as T);
  public modalHeader = new BehaviorSubject<string>('');

  ngOnInit(): void {
    const initValue = (this.location.getState() as any)?.['initValue'] ?? {};
    this.initValue.set(initValue);
  }

  protected close(initNewSearch = false): void {
    this.router.navigate([{ outlets: { sidebar: null } }], {
      state: { initNewSearch },
      replaceUrl: true,
    });
  }

  protected visibleChange(event: boolean): void {
    if (!event) {
      this.close(event);
    }
  }

  protected showMessage(summary: string, detail?: string): void {
    this.messageHandler.successEvent.next({
      summary,
      detail,
    });
  }
}
