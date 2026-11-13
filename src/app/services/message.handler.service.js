import { __decorate } from "tslib";
import { Service } from '@angular/core';
import { Subject } from 'rxjs';
let MessageHandlerService = class MessageHandlerService {
    successEvent = new Subject();
    successEventAsObservable() {
        return this.successEvent.asObservable();
    }
    errorEvent = new Subject();
    errorEventAsObservable() {
        return this.errorEvent.asObservable();
    }
};
MessageHandlerService = __decorate([
    Service()
], MessageHandlerService);
export { MessageHandlerService };
//# sourceMappingURL=message.handler.service.js.map