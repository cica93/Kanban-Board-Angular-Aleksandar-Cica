import { Component, input } from '@angular/core';

export type BadgeType = 'success' | 'info' | 'danger' | 'warning' | 'dark' | 'light';

@Component({
  selector: 'cica-badge',
  template: `
    <span
      class="badge"
      [class]="type()"
    >
      <ng-content />
    </span>
  `,
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  type = input<BadgeType>('info');
}
