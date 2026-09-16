import { inject, Injector, runInInjectionContext, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  BaseDialogComponent,
  SUBMIT_FORM_TOKEN,
  SUBMIT_FORM_TOKEN_LOAD,
} from './base-dialog/base-dialog.component';
import { AbstractTaskService } from '@service/abstract.task.service';

export function openDeleteModal(
  injector: Injector,
  textContent: string,
  header: string,
): Promise<HTMLIonModalElement> {
  return runInInjectionContext(injector, async () => {
    const modalController = inject(ModalController);
    const modal = await modalController.create({
      component: BaseDialogComponent,
      componentProps: {
        textContent: signal(textContent),
        header: signal(header),
        submitLabel: signal('Delete'),
        headerTextAlign: signal('start'),
      },
      cssClass: 'delete-modal',
    });
    await modal.present();
    return modal;
  });
}

export async function openEditModal(
  injector: Injector,
  initValue: any,
  header: string,
): Promise<HTMLIonModalElement> {
  return runInInjectionContext(injector, async () => {
    const modalController = inject(ModalController);
    const submitFormToken = await injector.get(SUBMIT_FORM_TOKEN_LOAD)();
    const modal = await modalController.create({
      component: BaseDialogComponent,
      componentProps: {
        initValue: signal(initValue),
        header: signal(header),
      },
      cssClass: 'custom-modal',
      injector: Injector.create({
        providers: [
          {
            provide: AbstractTaskService,
            useValue: injector.get(AbstractTaskService, { optional: true }),
          },
          {
            provide: SUBMIT_FORM_TOKEN,
            useValue: submitFormToken,
          },
        ],
      }),
    });

    await modal.present();

    return modal;
  });
}
