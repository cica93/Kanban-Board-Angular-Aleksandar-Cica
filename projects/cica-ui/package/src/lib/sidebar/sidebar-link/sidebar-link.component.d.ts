import { TemplateRef } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Subject } from 'rxjs';
import { SidebarLinkTemplateDirective } from './sidebar-link-template.directive';
export interface SidebarChildLink {
    url: string;
    label?: string;
}
export declare class SidebarLinkComponent {
  url: import('@angular/core').InputSignal<string | undefined>;
  label: import('@angular/core').InputSignal<string | undefined>;
  linkClick: import('@angular/core').OutputEmitterRef<void>;
  links$: import('@angular/core').Signal<readonly RouterLinkActive[]>;
  labelTemplate: import('@angular/core').Signal<TemplateRef<any> | undefined>;
  linkTemplates: import('@angular/core').Signal<readonly SidebarLinkTemplateDirective[]>;
  private readonly router;
  toggle: Subject<{
    event: 'click' | 'navigate';
    value?: boolean;
  }>;
  isOpen$: import('rxjs').Observable<boolean>;
  linkClicked(): void;
}
//# sourceMappingURL=sidebar-link.component.d.ts.map