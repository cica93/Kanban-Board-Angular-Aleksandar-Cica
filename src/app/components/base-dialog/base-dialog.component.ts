import { Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, config, Subject } from 'rxjs';
import { MessageHandlerService } from 'src/app/services/message.handler.service';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  template: '',
})
export class BaseDialogComponent<T = any> implements OnInit {
  private readonly location = inject(Location);
  private readonly messageHandler = inject(MessageHandlerService);
  private readonly router = inject(Router);
  protected initValue = signal<T>({} as T);
  public modalHeader = new BehaviorSubject<string>('');
  protected onSuccess = new Subject<T>();
  public onCancel = new Subject<void>();
  protected onError = new Subject<string>();
  public ref = inject(DynamicDialogRef, { optional: true });
  public config = inject(DynamicDialogConfig, { optional: true });

  ngOnInit(): void {
    const initValue = (this.location.getState() as any)?.['initValue'] ?? this.config?.data?.['initValue'] ?? ({} as T);
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

  protected closeModal(): void {
    this.ref?.close();
  }
}
