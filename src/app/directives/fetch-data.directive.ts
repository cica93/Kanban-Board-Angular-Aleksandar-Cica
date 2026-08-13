import {
  Directive,
  inject,
  InjectionToken,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  catchError,
  filter,
  merge,
  Observable,
  of,
  scan,
  switchMap,
  tap,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { BecomeVisibleDirective } from './become-visible-directive';
import { outputToObservable } from '@angular/core/rxjs-interop';

export const FETCH_DATA = new InjectionToken<
  (filter: any, slot?: number) => Observable<any[]>
>('USER_ID');

@Directive({
  selector: '[appFetchData]',
})
export class FetchDataDirective<T> implements OnInit {
  private readonly fetchData = inject(FETCH_DATA);
  private loading = false;
  private hasMore = true;
  private slot = 0;
  filterParams = input<any>({});
  appFetchData = output<T[]>();
  loadingChange = output<boolean>();
  becomeVisibleHtml = input.required<BecomeVisibleDirective>();
  filterParamsAsObservable$!: Observable<any>;

  constructor() {
    this.filterParamsAsObservable$ = toObservable(this.filterParams);
  }

  ngOnInit(): void {
    merge(
      outputToObservable(this.becomeVisibleHtml().becomeVisible).pipe(
        tap(() => {
          console.log('has more: ' + this.hasMore);
          console.log('loading: ' + this.loading);
        }),
        filter(() => !this.loading && this.hasMore),
        tap(() => {
          console.log('sssss');
          this.slot++;
          window.scrollBy({
            top: -200,
            behavior: 'instant',
          });
        }),
      ),
      this.filterParamsAsObservable$.pipe(
        tap(() => {
          this.slot = 0;
        }),
      ),
    )
      .pipe(
        switchMap(() => {
          this.setLoading(true);
          return this.fetchData(this.filterParams(), this.slot).pipe(
            tap((result) => {
              this.hasMore = result.length !== 0;
              this.setLoading();
              console.log(this.loading);
            }),
            catchError(() => {
              this.setLoading();
              return of([] as T[]);
            }),
          );
        }),
      )
      .pipe(
        scan((acc, curr) => {
          if (this.slot === 0) {
            return curr;
          }
          return [...acc, ...curr];
        }, [] as T[]),
      )
      .subscribe((data) => {
        this.appFetchData.emit(data);
      });
  }

  private setLoading(loading = false): void {
    this.loadingChange.emit(loading);
    this.loading = loading;
  }
}
