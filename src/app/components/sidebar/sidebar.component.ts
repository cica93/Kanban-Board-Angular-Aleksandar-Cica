import { Component, input, OnInit, output, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import {
  AvatarComponent,
  SidebarLinkComponent,
  SidebarLinkTemplateDirective,
  SidebarWrapperComponent,
} from 'cica-ui';

export interface SidebarUser {
  fullName: string;
}

@Component({
  imports: [
    SidebarLinkComponent,
    SidebarWrapperComponent,
    SlicePipe,
    SidebarLinkTemplateDirective,
    AvatarComponent,
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.component.scss',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  observer?: MutationObserver;
  sidebarSize = signal<'sm' | 'md' | 'lg'>('lg');
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
  user = input.required<SidebarUser>();
  logout = output<void>();

  sizeChange(event: 'sm' | 'lg' | 'md'): void {
    this.sidebarSize.set(event);
  }

  private getHtmlElement(): HTMLElement {
    return document.getElementsByTagName('html')[0]!;
  }

  private getAttribute(mutation: MutationRecord, attrinuteName: string): string | null {
    return (mutation.target as HTMLElement).getAttribute(attrinuteName);
  }
}
