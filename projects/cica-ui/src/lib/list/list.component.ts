import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-ui-list',
  styleUrl: './list.component.scss',
  template: `
    <div class="ui-list">
      <ng-content></ng-content>
    </div>
  `,
})
export class ListComponent {}
