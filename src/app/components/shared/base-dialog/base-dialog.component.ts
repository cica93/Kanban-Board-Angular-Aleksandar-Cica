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

export const SUBMIT_FORM_TOKEN_LOAD = new InjectionToken<() => Promise<Type<SubmitForm>>>(
  'submit.form.token.load',
);
export const SUBMIT_FORM_TOKEN = new InjectionToken<Type<SubmitForm>>('app.config');
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
  submitComponent = inject(SUBMIT_FORM_TOKEN, { optional: true });
  componentRef!: ComponentRef<SubmitForm>;
  dialogClose = output<unknown>();

  closeIcon = close;

  closeDialog(result?: string): void {
    this.dialogClose.emit(result);
    this.modalController.dismiss(closeDialogOnClick, result);
  }

  constructor() {
    effect(() => {
      const container = this.componentContainer();
      const component = this.submitComponent;

      if (!container || !component || this.componentRef) {
        return;
      }

      this.componentRef = container.createComponent(component, {
        bindings: [
          inputBinding('initValue', () =>
            this.initValue() ? structuredClone(this.initValue()) : this.initValue(),
          ),
        ],
      });

      this.componentRef.instance.onClose.subscribe((result) => {
        if (result) {
          this.closeDialog(successModalEvent);
        }
      });

      // Render the dynamically created component first
      this.componentRef.changeDetectorRef.detectChanges();
      // this.requestAnimation();
    });
  }

  requestAnimation() {
    requestAnimationFrame(() => {
      // this.componentReady.set(true);
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
