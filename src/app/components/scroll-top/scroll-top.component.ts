
import {
  Component,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrl: './scroll-top.component.scss',

  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class ScrollTopComponent {
  readonly threshold = input(400);

  readonly visible = signal(false);

  onWindowScroll(): void {
    this.visible.set(window.scrollY > this.threshold());
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}


