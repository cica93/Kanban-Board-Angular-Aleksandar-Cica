import { Component, contentChildren, effect, input } from '@angular/core';
import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { map, merge } from 'rxjs';


@Component({
  selector: 'cica-accordion',
  imports: [],
  template: `
      <ng-content select="cica-accordion-item" />
  `,
})
export class AccordionComponent {
  private items = contentChildren(AccordionItemComponent);
  multiple = input(false);
  initialyOpen = input<number[] | number>([]);

  constructor() {
    effect(() => {
      const items = this.items();

      const value = this.initialyOpen();
      const initiallyOpen = Array.isArray(value) ? value : [value];

      items.forEach((item, index) => {
        item.expanded.set(initiallyOpen.includes(index));
      });
    });

    // Handle toggle events
    effect((onCleanup) => {
      const items = this.items();

      const subscription = merge(
        ...items.map((item, index) =>
          outputToObservable(item.toggle).pipe(map(() => ({ item, index }))),
        ),
      ).subscribe(({ item, index }) => {
        if (this.multiple()) {
          item.expanded.update((value) => !value);
          return;
        }

        items.forEach((element, i) => {
          element.expanded.set(i === index ? !item.expanded() : false);
        });
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
