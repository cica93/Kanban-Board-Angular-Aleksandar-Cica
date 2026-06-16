import { Injectable } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageHandlerService {
  public successEvent = new Subject<ToastMessageOptions>();
  public successEventAsObservable(): Observable<ToastMessageOptions> {
    return this.successEvent.asObservable();
  }

  public errorEvent = new Subject<ToastMessageOptions>();
  public errorEventAsObservable(): Observable<ToastMessageOptions> {
    return this.errorEvent.asObservable();
  }
}
