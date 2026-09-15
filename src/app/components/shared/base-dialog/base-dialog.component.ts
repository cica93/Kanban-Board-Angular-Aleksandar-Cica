import {
  Component,
  ComponentRef,
  effect,
  inject,
  InjectionToken,
  input,
  inputBinding,
  InputSignal,
  output,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FieldTree, submit } from '@angular/forms/signals';
import { Subject } from 'rxjs';
import {
  IonButton,
  IonButtons,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { close } from 'ionicons/icons';

export interface SubmitForm<INIT_VALUE = any, FORM_VALUE = any> {
  initValue: InputSignal<INIT_VALUE | null | undefined>;
  form: FieldTree<FORM_VALUE>;
  onClose: Subject<boolean>;
}

export const FORM_TOKEN = new InjectionToken<() => Promise<Type<SubmitForm>>>('app.config');
export const successModalEvent = 'successModalEvent';
export const cancelModalEvent = 'cancelModalEvent';
export const closeDialogOnClick = 'closeDialogOnClick';

export interface BaseDialogConfiguration<T = any> {
  cancelLabel?: string;
  submitLabel?: string;
  textContent?: string;
  dialogHeader?: string;
  initValue?: T | null;
}

export type TextAlign = 'start' | 'center' | 'right';

@Component({
  selector: 'app-base-dialog',
  imports: [IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, IonFooter],
  templateUrl: './base-dialog.component.html',
})
export class BaseDialogComponent {
  private readonly modalController = inject(ModalController);
  componentContainer = viewChild.required('container', {
    read: ViewContainerRef,
  });

  initValue = input<unknown>();
  header = input<string>();
  textContent = input<string>('');
  cancelLabel = input<string>();
  submitLabel = input<string>();
  headerTextAlign = input<TextAlign>('center');
  data!: BaseDialogConfiguration;
  submitClick = output<void>();
  submitComponent = inject(FORM_TOKEN, { optional: true });
  componentRef!: ComponentRef<SubmitForm>;
  dialogClose = output<unknown>();

  closeIcon = close;

  closeDialog(result?: string): void {
    this.dialogClose.emit(result);
    this.modalController.dismiss(closeDialogOnClick, result);
  }

  constructor() {
    effect(async () => {
      const component = this.submitComponent ? await this.submitComponent() : null;
      if (this.componentContainer() && component) {
        this.componentRef = this.componentContainer()?.createComponent(component, {
          bindings: [
            inputBinding('initValue', () =>
              this.initValue() ? structuredClone(this.initValue(), {}) : this.initValue(),
            ),
          ],
        });
        this.componentRef.instance.onClose.asObservable().subscribe((result) => {
          if (result) {
            this.closeDialog(result ? successModalEvent : cancelModalEvent);
          }
        });
      }
    });
  }

  submitForm(): void {
    if (this.componentRef) {
      submit(this.componentRef.instance.form);
    } else {
      this.closeDialog(successModalEvent);
    }
  }
}
