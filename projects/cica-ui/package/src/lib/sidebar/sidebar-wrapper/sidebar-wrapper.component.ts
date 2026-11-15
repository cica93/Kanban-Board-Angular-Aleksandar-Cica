import { Component, input, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-sidebar-wrapper',
  styleUrl: './sidebar-wrapper.component.scss',
  templateUrl: './sidebar-wrapper.component.html',
})
export class SidebarWrapperComponent {
  size = model<'sm' | 'md' | 'lg'>('sm');
  position = input<'top' | 'left'>('left');
  theme = input<'light' | 'dark'>('light');

  toggleMenu(): void {
    this.size.update((value) => (value === 'sm' ? 'lg' : 'sm'));
  }
}
