import { AsyncPipe } from '@angular/common';
import { Component, contentChildren, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { combineLatest, map, merge, Observable, scan, Subject } from 'rxjs';

@Component({
  selector: 'app-link-group',
  imports: [AsyncPipe],
  templateUrl: './link-group.component.html',
})
export class LinkGroupComponent implements OnInit {
  links = contentChildren('a[routerLinkActive]',
    { descendants: true, read: RouterLinkActive });
  isActive$!: Observable<boolean>;
  toggle = new Subject<{event:'click' | 'navigate', value: boolean}>();
  ngOnInit(): void {
    this.isActive$ = merge(
      this.toggle,
      combineLatest(this.links().map((x) => x.isActiveChange)).pipe(
        map((x) => ({ event: 'navigate', value: x.some((y) => y) })),
      ),
    ).pipe(scan((acc, curr) => {
      if (curr.event === 'click') {
        return !acc;
      } else {
        return curr.value;
      }
    }, false));
  }
}
