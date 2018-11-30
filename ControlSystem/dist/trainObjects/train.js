"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Train {
    constructor(id, tagFront, tagBack) {
        this.id = id;
        this.tagFront = tagFront;
        this.tagBack = tagBack;
    }
    getId() {
        return this.id;
    }
    getTagFront() {
        return this.tagFront;
    }
    getTagBack() {
        return this.tagBack;
    }
}
exports.Train = Train;
//# sourceMappingURL=train.js.map