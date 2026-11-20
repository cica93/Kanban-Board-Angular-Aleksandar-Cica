import {
  Component,
  ComponentRef,
  EnvironmentInjector,
  inject,
  input,
  inputBinding,
  Injector,
  output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { submit } from '@angular/forms/signals';
import { ModalPosition } from '../service/modal.service';
import type { SubmitForm } from '../directives/modal.directive';

@Component({
  imports: [],
  selector: 'cica-modal',
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  cancelLabel = input<string | undefined>();
  confirmLabel = input<string | undefined>();
  fullHeight = input<boolean>(false);
  modalPosition = input<ModalPosition>('center');
  showWarningIcon = input<boolean>(true);
  headerText = input<string | undefined>();
  submitFormType = input<Type<SubmitForm> | null>(null);
  initValue = input<unknown>();
  onConfirm = output<void>();
  onCancel = output<void>();
  onSuccess = output<unknown>();
  @ViewChild('formHost', { read: ViewContainerRef })
  private formHost!: ViewContainerRef;
  private submitFormRef?: ComponentRef<SubmitForm<any, any>>;
  private readonly injector = inject(Injector);
  private readonly environmentInjector = inject(EnvironmentInjector);

  ngAfterViewInit(): void {
    const formType = this.submitFormType();
    if (!formType) {
      return;
    }

    const initialValue = this.initValue();
    const clonedValue = initialValue == null ? initialValue : structuredClone(initialValue);
    this.submitFormRef = this.formHost.createComponent<SubmitForm<any, any>>(formType, {
      injector: this.injector,
      environmentInjector: this.environmentInjector,
      bindings: [inputBinding('initValue', () => clonedValue)],
    });
    this.submitFormRef.instance.onSuccess.subscribe((result) => {
      if (result) {
        this.onSuccess.emit(result);
      }
    });
  }

  confirm(): void {
    if (this.submitFormRef) {
      submit(this.submitFormRef.instance.form);
    } else {
      this.onConfirm.emit();
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
