import { Component, OnInit } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-setup',
  styleUrl: './setup.component.scss',
  templateUrl: './setup.component.html',
})
export class SetupComponent implements OnInit {
  ngOnInit(): void {
    const html = this.getHtmlElement();
    document.querySelector<HTMLInputElement>(
      '#size-' + html.getAttribute('data-sidebar-size'),
    )!.checked = true;
    document.querySelector<HTMLInputElement>(
      '#direction-' + html.getAttribute('data-sidebar-direction'),
    )!.checked = true;
    document.querySelector<HTMLInputElement>(
      '#theme-' + html.getAttribute('data-sidebar-theme'),
    )!.checked = true;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-sidebar-size') {
          const element = mutation.target as HTMLElement;
          const newValue = element.getAttribute('data-sidebar-size');
          document.querySelector<HTMLInputElement>('#size-' + newValue)!.checked = true;
        }
      });
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['data-sidebar-size'],
    });
  }

  setHtmlProperty(proerty: string, value: string): void {
    this.getHtmlElement().setAttribute('data-sidebar-' + proerty, value);
  }

  private getHtmlElement(): HTMLElement {
    return document.getElementsByTagName('html')[0]!;
  }
}
