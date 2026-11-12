import { Component, input, output } from '@angular/core';
import { SidebarLinkComponent } from './sidebar-link/sidebar-link.component';
import { IonAvatar } from '@ionic/angular';
import { SlicePipe } from '@angular/common';
import { User } from '@service/user.service';

@Component({
  imports: [SidebarLinkComponent, IonAvatar, SlicePipe],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  user = input.required<User>();
  logout = output<void>();

  toggleMenu(): void {
    const sidebarSizeAttribute = 'data-sidebar-size';
    const html = document.getElementsByTagName('html')[0]!;
    if (html.getAttribute(sidebarSizeAttribute) === 'lg') {
      html.setAttribute(sidebarSizeAttribute, 'sm');
    } else {
      html.setAttribute(sidebarSizeAttribute, 'lg');
    }
  }
}
