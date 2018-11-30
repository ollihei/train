"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getAsString() {
        return `${this.x}-${this.y}`;
    }
}
exports.Coordinate = Coordinate;
//# sourceMappingURL=coordinate.js.map