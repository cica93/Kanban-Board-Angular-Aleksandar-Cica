import { Component, contentChildren, effect, model } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'cica-tabs',
  styleUrl: './tabs.component.scss',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  tabs = contentChildren<TabComponent>(TabComponent, { descendants: true });
  activeTab = model<number>(0);

  constructor() {
    effect(() => {
      const tabs = this.tabs();
      const initialIndex = this.activeTab();

      const validIndex = tabs.findIndex((tab, index) => index === initialIndex && !tab.disabled());

      const index = validIndex >= 0 ? validIndex : tabs.findIndex((tab) => !tab.disabled());

      this.activeTab.set(index);
    });
  }

  selectTab(index: number): void {
    const tab = this.tabs()[index];

    if (!tab || tab.disabled()) {
      return;
    }

    this.activeTab.set(index);
  }
}
