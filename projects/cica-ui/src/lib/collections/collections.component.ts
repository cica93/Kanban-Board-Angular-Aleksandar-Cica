import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'cica-collections',
  styleUrl: './collections.component.scss',
  templateUrl: './collections.component.html',
})
export class CollectionsComponent {
  items = input.required<any[]>();
  columns = input<number>(3);
  notFoundText = input<string>();
  tempate = contentChild<TemplateRef<any>>('itemTemplate');
}
