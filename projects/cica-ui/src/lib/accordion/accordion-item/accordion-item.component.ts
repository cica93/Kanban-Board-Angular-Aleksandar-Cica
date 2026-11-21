import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'cica-accordion-item',
  template: `
    <div
      class="accordion-item"
      [class.disabeld-item]="disabled()"
      [class.expanded]="expanded()"
      [class.first-child]="firstChild()"
      [class.last-child]="lastChild()"
    >
      <button
        type="button"
        class="accordion-header"
        [disabled]="disabled()"
        [attr.aria-expanded]="expanded()"
        (click)="toggle.emit()"
      >
        <span class="accordion-title">
          <ng-content select="cica-accordion-title" />
        </span>

        <svg
          class="accordion-icon"
          [class.rotated]="expanded()"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        class="accordion-content-wrapper"
        [class.open]="expanded()"
      >
        <div class="accordion-content">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styleUrl: './accordion-item.component.scss',
})
export class AccordionItemComponent {
  expanded = signal(false);
  disabled = input(false);
  firstChild = signal<boolean>(false);
  lastChild = signal<boolean>(false);

  toggle = output<void>();
}
