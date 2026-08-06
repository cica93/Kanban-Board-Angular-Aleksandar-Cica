import { DestroyRef, Directive, inject, InjectionToken, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, filter, fromEvent, merge, Observable, of, scan, switchMap, tap, throttleTime } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const FETCH_DATA  = new InjectionToken<(filter: any, slot?: number) => Observable<any[]>>('USER_ID');

@Directive({
  selector: '[appFetchData]',
})
export class FetchDataDirective<T> {
  private readonly fetchData = inject(FETCH_DATA);
  private loading = false;
  private hasMore = true;
  private slot = 0;
  private readonly destroyRef = inject(DestroyRef);
  filterParams = input<any>({});
  appFetchData = output<T[]>();
  loadingChange = output<boolean>();

  constructor() {
  merge(
    fromEvent(window, 'scroll').pipe(
      filter(() => {
        const threshold = 100;
        const position = window.innerHeight + window.scrollY;
        const height = document.body.scrollHeight;
        return height - position <= threshold && !this.loading && this.hasMore;
      }),
      throttleTime(500),
      tap(() => {
        this.slot++;
        window.scrollBy({
          top: -200,
          behavior: 'instant',
        });
      }),
    ),
    toObservable(this.filterParams).pipe(
      tap(() => {
        this.slot = 0;
      }),
    ),
  )
    .pipe(
      tap(() => {
        this.setLoading(true);
      }),
      switchMap(() =>
        this.fetchData(this.filterParams(), this.slot).pipe(
          tap((result) => {
            this.hasMore = result.length !== 0;
            this.setLoading();
          }),
          catchError(() => {
            this.setLoading();
            return of([]);
          }),
        ),
      ),
    )
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      scan((acc, curr) => {
        if (this.slot === 0) {
          return curr;
        }
        return [...acc, ...curr];
      }, [] as T[]),
    )
    .subscribe((value) => {
      this.appFetchData.emit(value);
    });
  }

  private setLoading(loading = false): void {
    this.loadingChange.emit(loading);
    this.loading = loading;
  }
}
