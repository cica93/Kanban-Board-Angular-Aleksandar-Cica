import { Component, computed, input } from '@angular/core';


@Component({
  selector: 'app-message-wrapper',
  imports: [],
  template: '<ng-content></ng-content>',
  host: { '[class]': 'hostClasses()' },
})
export class MessageWrapperComponent {
  type = input<'error' | 'warning'>('error');
  protected hostClasses = computed(() => {
    const color = this.type() === 'error' ? 'red' : 'orange';

    return `text-${color}-500 text-sm`;
  });
}
