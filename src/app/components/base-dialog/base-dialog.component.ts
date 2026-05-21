import { Location } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  template: '',
})
export abstract class BaseDialogComponent<T = any> implements OnInit {
  private readonly location = inject(Location);
  protected readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  protected initValue = signal<T>({} as T);
  public modalHeader = new BehaviorSubject<string>('');

  ngOnInit(): void {
    const initValue = (this.location.getState() as any)?.['initValue'] ?? {};
    this.initValue.set(initValue);
  }

  close(initNewSearch = false): void {
    this.router.navigate([{ outlets: { sidebar: null } }], {
      state: { initNewSearch },
      replaceUrl: true,
    });
  }

  visibleChange(event: boolean): void {
    if (!event) {
      this.close(event);
    }
  }
}
