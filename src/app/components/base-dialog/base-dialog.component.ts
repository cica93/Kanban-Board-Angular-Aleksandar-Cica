import { Location } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  template: '',
})
export abstract class BaseDialogComponent<T = any> implements OnInit {
  private readonly location = inject(Location);
  protected readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  public initValue: Partial<T> | undefined;

  ngOnInit(): void {
    this.initValue = (this.location.getState() as any)?.['initValue'] ?? {};
  }

  close(initNewSearch = false): void {
    this.router.navigate([{ outlets: { sidebar: null } }], {
      state: { initNewSearch },
    });
  }

  visibleChange(event: boolean): void {
    if (!event) {
      this.close(event);
    }
  }

  public abstract getModalHeader(): string;
}
