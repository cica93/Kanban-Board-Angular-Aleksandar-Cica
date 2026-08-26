import {
  Component,
  ComponentRef,
  effect,
  inject,
  InjectionToken,
  input,
  output,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FieldTree, submit } from '@angular/forms/signals';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';


export interface SubmitForm<INIT_VALUE = any, FORM_VALUE = any> {
  initValue?: INIT_VALUE | null;
  form: FieldTree<FORM_VALUE>;
  onClose: Subject<boolean>;

}

export const FORM_TOKEN = new InjectionToken<Type<SubmitForm>>('app.config');

export interface BaseDialogConfiguration<T = any> {
  cancelLabel?: string;
  submitLabel?: string;
  textContent?: string;
  dialogHeader?: string;
  initValue?: T | null;
}

@Component({
  selector: 'app-base-dialog',
  imports: [
    MatRippleModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
    MatDialogClose,
  ],
  templateUrl: './base-dialog.component.html',
})
export class BaseDialogComponent {
  componentContainer = viewChild.required('container', {
    read: ViewContainerRef,
  });

  header = input<string>();
  data!: BaseDialogConfiguration;
  private readonly dialogRef = inject(MatDialogRef<BaseDialogComponent>);
  submitClick = output<void>();
  submitComponent = inject(FORM_TOKEN, { optional: true });
  componentRef!: ComponentRef<SubmitForm>;
  
  closeDialog(result?: unknown): void {
    this.dialogRef.close(result);
  }

  constructor() {
    this.data = inject<BaseDialogConfiguration>(MAT_DIALOG_DATA) ?? {};
    effect(() => {
      if (this.componentContainer() && this.submitComponent) {
        this.componentRef = this.componentContainer()?.createComponent(
          this.submitComponent!,
        );
        this.componentRef.instance.initValue = this.data.initValue;
        this.componentRef.instance.onClose.asObservable().subscribe(result => {
          if (result) {
            console.log('Close dialog')
            this.closeDialog(result)
          }
        })
      }
    });
  }

  submitForm(): void {
    if (this.componentRef) {
      submit(this.componentRef.instance.form);
    } else {
      this.closeDialog(true);
    }
  }
}
