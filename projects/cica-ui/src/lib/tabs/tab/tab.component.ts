import { Component, contentChild, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-tab',
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class TabComponent {
  label = input<string>('');
  header = contentChild<TemplateRef<any>>('header');
  content = viewChild<TemplateRef<any>>('content');
  disabled = input<boolean>(false);
}
