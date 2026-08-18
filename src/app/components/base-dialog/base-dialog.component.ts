import {
  Component,
  inject,
  InjectionToken,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RippleModule } from 'primeng/ripple';
import { Subject } from 'rxjs';

export interface SubmitForm {
  submit(event: PointerEvent): Promise<boolean>;
  submiting: Subject<boolean>;
  modalHeader: Subject<string>;
}

export const SUBMIT_TOKEN = new InjectionToken<SubmitForm>('app.config');

@Component({
  selector: 'app-base-dialog',
  imports: [ButtonModule, RippleModule],
  templateUrl: './base-dialog.component.html',
})
export class BaseDialogComponent<T = any> {
  headerChange = output<string>();
  onClose = output<boolean>();

  protected initValue?: T | null;

  protected onSuccess = new Subject<T>();
  public onCancel = new Subject<void>();
  protected onError = new Subject<string>();
  public ref = inject(DynamicDialogRef, { optional: true });
  public config = inject(DynamicDialogConfig, { optional: true });
  protected submittingForm = signal(false);
  private activeComponent: any;

  setActiveComponent(component: any) {
    this.activeComponent = component;
    if (this.activeComponent) {
      this.activeComponent.modalHeader.asObservable().subscribe((e: string) => {
        this.headerChange.emit(e);
      });
      this.activeComponent.onClose.asObservable().subscribe((e: boolean) => {
        this.onClose.emit(e);
      });
      this.activeComponent.submiting
        .asObservable()
        .subscribe(this.submittingForm.set);
    }
  }

  async submit(event: PointerEvent): Promise<void> {
    event.preventDefault();
    await this.activeComponent?.submit();
  }
}
