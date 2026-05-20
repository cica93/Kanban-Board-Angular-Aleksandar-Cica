import { SlicePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { User } from 'src/app/services/user.service';

@Component({
  selector: 'app-avatar-group',
  templateUrl: './avatar-group.component.html',
  styleUrl: './avatar-group.component.scss',
  imports: [SlicePipe, MatTooltip],
})
export class AvatarGroupComponent {
  users = input.required<User[] | null>();
}
