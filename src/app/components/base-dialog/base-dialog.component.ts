import { Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageHandlerService } from '@service/message.handler.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  template: '',
})
export class BaseDialogComponent<T = any> implements OnInit {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  protected initValue = signal<T>({} as T);
  public modalHeader = new BehaviorSubject<string>('');
  private readonly messageHandlerService = inject(MessageHandlerService);
  protected onSuccess = new Subject<T>();
  public onCancel = new Subject<void>();
  protected onError = new Subject<string>();
  public ref = inject(DynamicDialogRef, { optional: true });
  public config = inject(DynamicDialogConfig, { optional: true });

  ngOnInit(): void {
    const initValue =
      (this.location.getState() as any)?.['initValue'] ??
      this.config?.data?.['initValue'] ??
      ({} as T);
    this.initValue.set(initValue);
  }

  public closeDialog(event: PointerEvent) {
    event.preventDefault();
    this.close();
  }

  public close(initNewSearch = false): void {
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
    this.messageHandlerService.successEvent.next({
      summary,
      detail,
    });
  }

  protected closeModal(): void {
    this.ref?.close();
  }
}
