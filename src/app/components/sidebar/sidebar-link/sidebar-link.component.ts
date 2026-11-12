import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, map, merge, scan, startWith, Subject, switchMap } from 'rxjs';

export interface SidebarChildLink {
  url: string;
  label?: string;
}

@Component({
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  selector: 'app-sidebar-link',
  styleUrl: './sidebar-link.component.scss',
  templateUrl: './sidebar-link.component.html',
})
export class SidebarLinkComponent {
  url = input<string | undefined>();
  icon = input.required<string>();
  label = input.required<string>();
  childLinks = input<SidebarChildLink[] | undefined>();
  linkClick = output<void>();
  links$ = viewChildren(RouterLinkActive);

  private readonly router = inject(Router);

  toggle = new Subject<{ event: 'click' | 'navigate'; value?: boolean }>();

  isOpen$ = merge(
    toObservable(this.links$).pipe(
      switchMap((links) =>
        combineLatest(
          links.map((e) => e.isActiveChange.asObservable().pipe(startWith(false))),
        ).pipe(
          map((isActiveAnyLink) => ({
            event: 'navigate',
            value: isActiveAnyLink.some(Boolean),
          })),
        ),
      ),
    ),
    this.toggle.asObservable(),
  ).pipe(
    scan((acc, cur) => {
      if (cur.event === 'click') {
        return !acc;
      }
      return cur?.value ?? false;
    }, false),
  );

  linkClicked(): void {
    if (this.url()) {
      this.router.navigate([this.url()]);
    }
    this.linkClick.emit();
  }
}
