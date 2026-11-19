import { Component, contentChild, model, TemplateRef } from '@angular/core';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  imports: [NgTemplateOutlet, ClickOutsideDirective],
  selector: 'cica-menu-button',
  styleUrl: './menu-button.component.scss',
  templateUrl: './menu-button.component.html',
})
export class MenuButtonComponent {
  trigerTempalate = contentChild<TemplateRef<any>>('trigerTempalate');
  isOpen = model(false);
}
