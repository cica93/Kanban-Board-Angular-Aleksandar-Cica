import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  EnvironmentInjector,
  inject,
  Injector,
  inputBinding,
  Service,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { SUBMIT_FORM_TOKEN_LOAD, SubmitForm } from '../directives/modal.directive';

export type ModalPosition = 'left' | 'center' | 'right';

export interface ModalOptions {
  cancelLabel?: string;
  confirmLabel?: string;
  headerText?: string;
  fullHeight?: boolean;
  initValue?: any;
  modalPosition: ModalPosition;
  showWarningIcon?: boolean;
  content?: string | TemplateRef<any>;
}

@Service()
export class ModalService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);

  async openEditModal(config: {
    environmentInjector?: EnvironmentInjector;
    injector?: Injector;
    modalOptions: ModalOptions;
  }): Promise<{
    componentRef: ComponentRef<ModalComponent>;
    submitFormRef: ComponentRef<SubmitForm<any, any>>;
  }> {
    const injector = config.injector ?? this.injector;
    const loadSubmitForm = injector.get(SUBMIT_FORM_TOKEN_LOAD, null);
    if (typeof loadSubmitForm !== 'function') {
      throw new Error('No SubmitForm loader is configured in the provided injector.');
    }
    const submitFormToken: Type<SubmitForm> = await loadSubmitForm();
    const submitFormRef = createComponent<SubmitForm<any, any>>(submitFormToken, {
      environmentInjector: config.environmentInjector ?? this.environmentInjector,
      elementInjector: injector,
      bindings: [inputBinding('initValue', () => config.modalOptions.initValue)],
    });
    this.appRef.attachView(submitFormRef.hostView);

    const componentRef = createComponent(ModalComponent, {
      environmentInjector: config.environmentInjector ?? this.environmentInjector,
      elementInjector: config.injector ?? this.injector,
      bindings: [
        inputBinding('cancelLabel', () => config.modalOptions?.cancelLabel),
        inputBinding('confirmLabel', () => config.modalOptions?.confirmLabel),
        inputBinding('headerText', () => config.modalOptions?.headerText),
        inputBinding('fullHeight', () => true),
        inputBinding('modalPosition', () => 'right'),
        inputBinding('showWarningIcon', () => false),
      ],
      projectableNodes: [[submitFormRef.location.nativeElement as Node]],
    });
    componentRef.onDestroy(() => {
      if (!submitFormRef.hostView.destroyed) {
        this.appRef.detachView(submitFormRef.hostView);
        submitFormRef.destroy();
      }
    });
    this.attachView(componentRef, undefined);
    return { componentRef, submitFormRef };
  }

  openDeleteModal(config: {
    environmentInjector?: EnvironmentInjector;
    injector?: Injector;
    modalOptions: ModalOptions;
  }): ComponentRef<ModalComponent> {
    const content = config.modalOptions.content ?? '';
    let contentView: EmbeddedViewRef<any> | undefined;
    let contentNodes: Node[];

    if (typeof content === 'string') {
      const span = document.createElement('span');
      span.textContent = content;
      contentNodes = [span];
    } else {
      contentView = content.createEmbeddedView({});
      contentView.detectChanges();
      contentNodes = contentView.rootNodes;
    }

    const componentRef = createComponent<ModalComponent>(ModalComponent, {
      environmentInjector: config.environmentInjector ?? this.environmentInjector,
      elementInjector: config.injector ?? this.injector,
      bindings: [
        inputBinding('cancelLabel', () => config.modalOptions?.cancelLabel),
        inputBinding('confirmLabel', () => config.modalOptions?.confirmLabel),
        inputBinding('headerText', () => config.modalOptions?.headerText),
        inputBinding('fullHeight', () => config.modalOptions?.fullHeight),
        inputBinding('modalPosition', () => 'center'),
        inputBinding('showWarningIcon', () => true),
      ],
      projectableNodes: [contentNodes],
    });
    this.attachView(componentRef, contentView);
    return componentRef;
  }

  close(componentRef: ComponentRef<ModalComponent>): void {
    destroy(this.appRef, componentRef);
  }

  private attachView(
    componentRef: ComponentRef<ModalComponent>,
    contentView: EmbeddedViewRef<any> | undefined,
  ): void {
    componentRef.onDestroy(() => contentView?.destroy());
    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }
}

export function destroy<T>(appRef: ApplicationRef, componentRef: ComponentRef<T>): void {
  appRef.detachView(componentRef.hostView);
  componentRef.destroy();
}

export function templateToNodes<T>(
  template: TemplateRef<T> | string,
  viewContainer: ViewContainerRef,
): Node[] {
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

export function closeModal(
  appRef: ApplicationRef, ref: ComponentRef<ModalComponent> | undefined,
  submitFormComponentRef?: ComponentRef<SubmitForm<any, any>>,
): void {
  const componentRef = ref;
  ref = undefined;
  submitFormComponentRef?.destroy();
  submitFormComponentRef = undefined;

  if (!componentRef) {
    return;
  }

  componentRef.location.nativeElement.remove();
  if (componentRef.hostView.destroyed) {
    return;
  }

  destroy(appRef, componentRef);
}

export function createSubmitForm(
  component: Type<SubmitForm>,
  viewContainer: ViewContainerRef,
  injector: Injector,
  environmentInjector: EnvironmentInjector,
  initValue: any,
): ComponentRef<SubmitForm> {
    return viewContainer.createComponent<SubmitForm<any, any>>(component, {
        injector: injector,
        environmentInjector: environmentInjector,
        bindings: [
            inputBinding('initValue', () => (initValue ? structuredClone(initValue) : initValue))
        ],
    });
}


