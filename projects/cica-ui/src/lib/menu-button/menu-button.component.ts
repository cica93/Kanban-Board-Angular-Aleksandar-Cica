import {
  Component,
  computed,
  contentChild,
  ElementRef,
  input,
  model,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { NgTemplateOutlet } from '@angular/common';
import { calculateFits } from '../directives/tooltip.directive';

@Component({
  imports: [NgTemplateOutlet, ClickOutsideDirective],
  selector: 'cica-menu-button',
  styleUrl: './menu-button.component.scss',
  templateUrl: './menu-button.component.html',
})
export class MenuButtonComponent {
  trigerTempalate = contentChild<TemplateRef<any>>('trigerTempalate');
  isOpen = model(false);
  position = input<'left' | 'right'>('right');

  dropdownElement = viewChild<ElementRef<HTMLElement>>('dropdownElement');
  menuElement = viewChild<ElementRef<HTMLElement>>('menuElement');

  menuPosition = computed(() => {
    if (!this.menuElement()) {
      return { horizontal: 'left', vertical: 'bottom' };
    }
    const { clientHeight, clientWidth } = document.documentElement;
    const { bottom, left, right } = calculateFits(
      this.dropdownElement()!.nativeElement.getBoundingClientRect(),
      this.menuElement()!.nativeElement.getBoundingClientRect(),
      clientHeight,
      clientWidth,
    );

    return {
      horizontal: this.position() === 'left' ? (left ? 'left' : 'right') : right ? 'right' : 'left',
      vertical: bottom ? 'bottom' : 'top',
    };
  });
}
