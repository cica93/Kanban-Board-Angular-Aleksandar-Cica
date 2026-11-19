import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-ui-list-item',
  styleUrl: './list-item.component.scss',
  template: `
    <div
      class="ui-list-item"
      [class.clickable]="button()"
    >
      <div class="item-start">
        <ng-content select="[slot=start]"></ng-content>
      </div>

      <div class="item-content">
        <ng-content></ng-content>
      </div>

      <div class="item-end">
        <ng-content select="[slot=end]"></ng-content>
      </div>
    </div>
  `,
})
export class ListItemComponent {
  button = input(false);
}
