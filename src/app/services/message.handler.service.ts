import { Service } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ToastMessageOptions {
  message?: string;
  life?: number;
  detail?: string;
  summary?: string;
}

@Service()
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
