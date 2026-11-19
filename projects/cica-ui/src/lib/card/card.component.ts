import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'cica-card',
  styleUrl: './card.component.scss',
  templateUrl: './card.component.html',
})
export class CardComponent {
  cardTitle = input.required<string>();
  cardSubtitle = input<string>('');
}
