import { Component, input, OnInit, output, signal } from '@angular/core';
import { SidebarLinkComponent } from './sidebar-link/sidebar-link.component';
import { IonAvatar } from '@ionic/angular';
import { SlicePipe } from '@angular/common';
import { User } from '@service/user.service';
import { SidebarWrapperComponent } from './sidebar-wrapper/sidebar-wrapper.component';

@Component({
  imports: [SidebarLinkComponent, SidebarWrapperComponent, IonAvatar, SlicePipe],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  observer?: MutationObserver;
  sidebarSize = signal<'sm' | 'md' | 'lg'>('sm');
  sidebarTheme = signal<'light' | 'dark'>('dark');
  sidebarPosition = signal<'top' | 'left'>('left');
  ngOnInit(): void {
    const sidebarSize = 'data-sidebar-size';
    const sidebarPosition = 'data-sidebar-position';
    const sidebarTheme = 'data-sidebar-theme';

    const html = this.getHtmlElement();
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === sidebarSize) {
          this.sidebarSize.set(
            (this.getAttribute(mutation, sidebarSize) as 'sm' | 'md' | 'lg' | null) ?? 'sm',
          );
        } else if (mutation.attributeName === sidebarPosition) {
          this.sidebarPosition.set(
            (this.getAttribute(mutation, sidebarPosition) as 'top' | 'left' | null) ?? 'left',
          );
        } else {
          this.sidebarTheme.set(
            (this.getAttribute(mutation, sidebarTheme) as 'light' | 'dark' | null) ?? 'dark',
          );
        }
      });
    });

    this.observer.observe(html, {
      attributes: true,
      attributeFilter: [sidebarSize, sidebarPosition, sidebarTheme],
    });
  }
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

  private getHtmlElement(): HTMLElement {
    return document.getElementsByTagName('html')[0]!;
  }

  private getAttribute(mutation: MutationRecord, attrinuteName: string): string | null {
    return (mutation.target as HTMLElement).getAttribute(attrinuteName);
  }
}
