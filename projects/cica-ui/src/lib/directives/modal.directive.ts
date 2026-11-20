import {
  ApplicationRef,
  ComponentRef,
  Directive,
  EnvironmentInjector,
  inject,
  input,
  output,
  TemplateRef,
  Injector,
  InjectionToken,
  InputSignal,
  Type,
} from '@angular/core';
import { FieldTree, submit } from '@angular/forms/signals';
import { Subject } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { closeModal, ModalService } from '../service/modal.service';

export interface SubmitForm<INIT_VALUE = any, FORM_VALUE = any> {
  initValue: InputSignal<INIT_VALUE | null | undefined>;
  form: FieldTree<FORM_VALUE>;
  onSuccess: Subject<boolean>;
}

export const SUBMIT_FORM_TOKEN_LOAD = new InjectionToken<() => Promise<Type<SubmitForm>>>(
  'submit.form.token.load',
);

export const SUBMIT_FORM_TOKEN = new InjectionToken<Type<SubmitForm>>('app.config');

@Directive({
  selector: '[cicaModal]',
  host: {
    '(click)': 'handleClick()',
  },
})
export class ModalDirective {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly modalService = inject(ModalService);
  initValue = input<any>();
  cicaModal = input.required<string | TemplateRef<any>>();
  cancelLabel = input<string | undefined>();
  confirmLabel = input<string | undefined>();
  showWarningIcon = input<boolean>(false);
  fullHeight = input<boolean>(false);
  modalPosition = input<'left' | 'center' | 'right'>('center');
  isDelete = input<boolean>(false);
  headerText = input<string | undefined>();
  onConfirm = output<{
    componentRef: ComponentRef<ModalComponent>;
    appRef: ApplicationRef;
  }>();
  onSuccess = output<any>();
  modalOpenEvent = output<ComponentRef<ModalComponent>>();
  onCancel = output<void>();
  componentRef?: ComponentRef<ModalComponent>;
  private submitFormComponentRef?: ComponentRef<SubmitForm<any, any>>;

  async handleClick(): Promise<void> {
    const submitFormToken =
      !this.isDelete() && (await this.injector.get(SUBMIT_FORM_TOKEN_LOAD, null)?.());

    if (submitFormToken) {
      const { componentRef, submitFormRef } = await this.modalService.openEditModal({
        environmentInjector: this.environmentInjector,
        injector: this.injector,
        modalOptions: {
          modalPosition: 'right',
          confirmLabel: this.confirmLabel(),
          headerText: this.headerText(),
          initValue: this.initValue(),
        },
      });
      componentRef.instance.onCancel.subscribe(() => {
        this.modalService.close(componentRef);
      });
      componentRef.instance.onConfirm.subscribe(() => {
        submit(submitFormRef.instance.form);
      });
      submitFormRef.instance.onSuccess.subscribe(() => {
        this.modalService.close(componentRef);
      });
    } else {
      const modalRef = this.modalService.openDeleteModal({
        modalOptions: {
          modalPosition: 'center',
          confirmLabel: this.confirmLabel(),
          headerText: this.headerText(),
          content: this.cicaModal(),
        },
      });

      modalRef.instance.onCancel.subscribe(() => {
        closeModal(this.appRef, modalRef, this.submitFormComponentRef);
      });
      modalRef.instance.onConfirm.subscribe(() => {
        closeModal(this.appRef, modalRef, this.submitFormComponentRef);
        this.onConfirm.emit({ componentRef: modalRef, appRef: this.appRef });
      });
    }
  }
}
