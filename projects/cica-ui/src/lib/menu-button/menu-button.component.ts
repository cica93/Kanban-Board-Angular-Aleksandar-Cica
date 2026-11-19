import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-menu-button',
  styleUrl: './menu-button.component.scss',
  templateUrl: './menu-button.component.html',
})
export class MenuButtonComponent {
  isOpen = input<boolean>(false);
  isHidden = input<boolean>(false);
  dropdownTrigger = output<void>();
}
