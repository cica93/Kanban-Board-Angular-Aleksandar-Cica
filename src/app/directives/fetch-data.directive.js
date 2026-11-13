import { __decorate } from "tslib";
import { Directive, inject, InjectionToken, input, output } from '@angular/core';
import { catchError, filter, merge, of, scan, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { outputToObservable } from '@angular/core/rxjs-interop';
export const FETCH_DATA = new InjectionToken('USER_ID');
let FetchDataDirective = class FetchDataDirective {
    fetchData = inject(FETCH_DATA);
    loading = false;
    hasMore = true;
    slot = 0;
    fetchDisabed = input(false);
    filterParams = input({});
    accumulatorCallBack = input((acc, curr) => [
        ...acc,
        ...curr,
    ]);
    hasMoreCallBack = input((value) => !!value.length);
    appFetchData = output();
    loadingChange = output();
    becomeVisibleHtml = input.required();
    filterParamsAsObservable$;
    constructor() {
        this.filterParamsAsObservable$ = toObservable(this.filterParams);
    }
    ngOnInit() {
        if (!this.fetchDisabed()) {
            merge(outputToObservable(this.becomeVisibleHtml().becomeVisible).pipe(filter(() => !this.loading && this.hasMore), tap(() => {
                this.slot++;
                window.scrollBy({
                    top: -200,
                    behavior: 'instant',
                });
            })), this.filterParamsAsObservable$.pipe(tap(() => {
                this.slot = 0;
            })))
                .pipe(filter(() => false), switchMap(() => {
                this.setLoading(true);
                return this.fetchData(this.filterParams(), this.slot).pipe(tap((result) => {
                    this.hasMore = this.hasMoreCallBack()(result);
                    this.setLoading();
                }), catchError(() => {
                    this.setLoading();
                    return of([]);
                }));
            }))
                .pipe(scan((acc, curr) => {
                if (this.slot === 0) {
                    return curr;
                }
                return this.accumulatorCallBack()(acc, curr);
            }, []))
                .subscribe((data) => {
                this.appFetchData.emit(data);
            });
        }
    }
    setLoading(loading = false) {
        this.loadingChange.emit(loading);
        this.loading = loading;
    }
};
FetchDataDirective = __decorate([
    Directive({
        selector: '[appFetchData]',
    })
], FetchDataDirective);
export { FetchDataDirective };
//# sourceMappingURL=fetch-data.directive.js.map