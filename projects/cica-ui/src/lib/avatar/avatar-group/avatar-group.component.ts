import { Component } from '@angular/core';


@Component({
  selector: 'cica-avatar-group',
  template: ` <ng-content select="cica-avatar"></ng-content> `,
  styleUrl: './avatar-group.component.scss',
})
export class AvatarGroupComponent {

}
