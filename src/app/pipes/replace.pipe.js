import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let ReplacePipe = class ReplacePipe {
    transform(value, oldChar, replacement) {
        return value.replace(oldChar, replacement);
    }
};
ReplacePipe = __decorate([
    Pipe({
        name: 'replace',
        pure: true,
        standalone: true,
    })
], ReplacePipe);
export { ReplacePipe };
//# sourceMappingURL=replace.pipe.js.map