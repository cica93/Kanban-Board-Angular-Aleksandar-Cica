import { ApplicationRef, ComponentRef, createComponent, Directive, DestroyRef, ElementRef, EnvironmentInjector, inject, input, inputBinding, OnInit, output, outputBinding, TemplateRef, ViewContainerRef } from '@angular/core';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Directive({
  selector: '[cicaConfirm]',
})
export class ConfirmDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);
  private viewContainer = inject(ViewContainerRef);
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);
  private destroyRef = inject(DestroyRef);
  cicaConfirm = input.required<string | TemplateRef<any>>();
  cancelLabel = input<string | undefined>();
  confirmLabel = input<string | undefined>();
  showWarningIcon = input<boolean | undefined>();
  headerText = input<string | undefined>();
  onConfirm = output<{
    componentRef: ComponentRef<ConfirmModalComponent>;
    appRef: ApplicationRef;
  }>();
  modalOpenEvent = output<ComponentRef<ConfirmModalComponent>>();
  onCancel = output<void>();
  componentRef?: ComponentRef<ConfirmModalComponent>;

  ngOnInit(): void {
    const handleClick = () => {
      if (this.destroyRef.destroyed) {
        return;
      }
      

      this.componentRef = createComponent(ConfirmModalComponent, {
        environmentInjector: this.environmentInjector,
        bindings: [
          inputBinding('cancelLabel', this.cancelLabel),
          inputBinding('confirmLabel', this.confirmLabel),
          inputBinding('headerText', this.headerText),
          inputBinding('showWarningIcon', () => this.showWarningIcon() ?? true),
          outputBinding('onCancel', () => {
            this.closeModal();
            if (!this.destroyRef.destroyed) {
              this.onCancel.emit();
            }
          }),
          outputBinding('onConfirm', () => {
            if (!this.destroyRef.destroyed && this.componentRef) {
              this.onConfirm.emit({ componentRef: this.componentRef, appRef: this.appRef });
            }
          }),
        ],
        projectableNodes: [templateToNodes(this.cicaConfirm(), this.viewContainer)],
      });
      this.modalOpenEvent.emit(this.componentRef);
      this.appRef.attachView(this.componentRef.hostView);
      document.body.appendChild(this.componentRef.location.nativeElement);
    };

    this.el.nativeElement.addEventListener('click', handleClick);
    this.destroyRef.onDestroy(() => {
      this.el.nativeElement.removeEventListener('click', handleClick);
    });
  }

  private closeModal(): void {
    const componentRef = this.componentRef;
    this.componentRef = undefined;

    if (!componentRef) {
      return;
    }

    componentRef.location.nativeElement.remove();
    if (componentRef.hostView.destroyed) {
      return;
    }

    destroy(this.appRef, componentRef);
  }
}

export function destroy<T>(appRef: ApplicationRef, componentRef: ComponentRef<T>): void {
  appRef.detachView(componentRef.hostView);
  componentRef.destroy();
}

export function templateToNodes<T>(template: TemplateRef<T> | string, viewContainer: ViewContainerRef): Node[] {
  if (typeof template === 'string') {
    const span = document.createElement('span');
    span.textContent = template;
    const nodes: Node[] = [span];
    return nodes;
  }
  const view = viewContainer.createEmbeddedView(template);

  view.detectChanges();

  return [...view.rootNodes];
}
