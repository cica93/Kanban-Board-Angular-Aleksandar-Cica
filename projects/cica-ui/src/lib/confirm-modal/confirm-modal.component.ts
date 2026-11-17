import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-confirm-modal',
  styleUrl: './confirm-modal.component.scss',
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  cancelLabel = input<string | undefined>();
  confirmLabel = input<string | undefined>();
  showWarningIcon = input<boolean>(true);
  headerText = input<string | undefined>();
  onConfirm = output<void>();
  onCancel = output<void>();

  confirm(): void {
    this.onConfirm.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
