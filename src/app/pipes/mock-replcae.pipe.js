import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let MockReplacePipe = class MockReplacePipe {
    transform(value, search, replace) {
        return value.replace(new RegExp(search, 'g'), replace);
    }
};
MockReplacePipe = __decorate([
    Pipe({ name: 'replace' })
], MockReplacePipe);
export { MockReplacePipe };
//# sourceMappingURL=mock-replcae.pipe.js.map