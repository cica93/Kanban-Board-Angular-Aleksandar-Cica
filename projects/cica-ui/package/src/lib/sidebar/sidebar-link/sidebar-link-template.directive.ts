import { Directive, TemplateRef, input, inject } from '@angular/core';

interface TemplateContext {
    url: string;
    label?: string;
}

@Directive({
  selector: '[cicaSidebarLink]',
})
export class SidebarLinkTemplateDirective {
  templateRef = inject(TemplateRef<TemplateContext>);
  url = input.required<string>();
  label = input<string | undefined>();
}
