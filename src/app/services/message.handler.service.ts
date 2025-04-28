import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageHandlerService {
  public successEvent: Subject<{ summary?: string; detail: string }> =
    new Subject<{ summary?: string; detail: string }>();
  public successEventAsObservable(): Observable<{
    summary?: string;
    detail: string;
  }> {
    return this.successEvent.asObservable();
  }

  public errorEvent: Subject<{ summary?: string; detail: string }> =
    new Subject<{ summary?: string; detail: string }>();
  public errorEventAsObservable(): Observable<{
    summary?: string;
    detail: string;
  }> {
    return this.successEvent.asObservable();
  }
}
