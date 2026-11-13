import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { TitleStrategy } from '@angular/router';
let KanbanTitle = class KanbanTitle extends TitleStrategy {
    title;
    constructor(title) {
        super();
        this.title = title;
    }
    updateTitle(snapshot) {
        const title = this.buildTitle(snapshot);
        if (title) {
            this.title.setTitle(`Kanban | ${title}`);
        }
    }
};
KanbanTitle = __decorate([
    Injectable()
], KanbanTitle);
export { KanbanTitle };
//# sourceMappingURL=kanban.title.service.js.map