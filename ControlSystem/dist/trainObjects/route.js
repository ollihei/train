"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Route {
    constructor(id) {
        this.tracks = [];
        this.id = id;
    }
    addTrack(track) {
        this.tracks.push(track);
    }
}
exports.Route = Route;
//# sourceMappingURL=route.js.map