import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-setup',
  styleUrl: './setup.component.scss',
  templateUrl: './setup.component.html',
})
export class SetupComponent implements OnInit, OnDestroy {
  observer?: MutationObserver;
  ngOnInit(): void {
    const sidebarSize = 'data-sidebar-size';
    const html = this.getHtmlElement();
    document.querySelector<HTMLInputElement>('#size-' + html.getAttribute(sidebarSize))!.checked =
      true;
    document.querySelector<HTMLInputElement>(
      '#position-' + html.getAttribute('data-sidebar-position'),
    )!.checked = true;
    document.querySelector<HTMLInputElement>(
      '#theme-' + html.getAttribute('data-sidebar-theme'),
    )!.checked = true;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === sidebarSize) {
          const newValue = this.getAttribute(mutation, sidebarSize);
          document.querySelector<HTMLInputElement>('#size-' + newValue)!.checked = true;
        }
      });
    });

    this.observer.observe(html, {
      attributes: true,
      attributeFilter: [sidebarSize],
    });
  }

  private getAttribute(mutation: MutationRecord, attrinuteName: string): string | null {
    return (mutation.target as HTMLElement).getAttribute(attrinuteName);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  setHtmlProperty(proerty: string, value: string): void {
    this.getHtmlElement().setAttribute('data-sidebar-' + proerty, value);
  }

  private getHtmlElement(): HTMLElement {
    return document.getElementsByTagName('html')[0]!;
  }
}
