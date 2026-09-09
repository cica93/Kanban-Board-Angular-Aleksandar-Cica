import { AsyncPipe } from '@angular/common';
import { Component, contentChildren, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLinkActive } from '@angular/router';
import {
  combineLatest,
  map,
  merge,
  Observable,
  scan,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-link-group',
  imports: [AsyncPipe],
  templateUrl: './link-group.component.html',
})
export class LinkGroupComponent implements OnInit {
  links = contentChildren(RouterLinkActive, {
    descendants: true,
  });
  links$ = toObservable(this.links);
  isActive$!: Observable<boolean>;
  toggle = new Subject<{ event: 'click' | 'navigate'; value?: boolean }>();
  ngOnInit(): void {
    this.isActive$ = merge(
      this.links$.pipe(
        switchMap((links) =>
          combineLatest(
            links.map((e) =>
              e.isActiveChange.asObservable().pipe(startWith(false)),
            ),
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
  }

  onClick(event: PointerEvent): void {
    const { tagName } = event.target as HTMLElement;
    if (tagName !== 'A') {
      this.toggle.next({ event: 'click' });
    }
  }
}
