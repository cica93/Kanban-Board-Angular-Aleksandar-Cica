import { Component, input } from '@angular/core';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'cica-avatar',
  template: `
    <div
      class="avatar"
      [class]="[size(), shape(), status() ? 'has-status' : '']"
    >
      @if (src()) {
        <img
          [src]="src()"
        />
      } @else {
        <span class="initials"><ng-content /></span>
      }

      @if (status()) {
        <span
          class="status"
          [class]="status()"
        ></span>
      }
    </div>
  `,
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  src = input<string | null | undefined>(null);
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');
  status = input<'online' | 'offline' | 'busy' | null>(null);

}
