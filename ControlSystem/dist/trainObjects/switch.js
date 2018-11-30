"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Switch {
    constructor(location) {
        this.switchConnections = [];
        this.location = location;
    }
    addSwitchConnection(state, route1, route2) {
        this.switchConnections.push({
            route1: route1,
            route2: route2,
            state: state
        });
    }
}
exports.Switch = Switch;
class SwitchConnection {
}
exports.SwitchConnection = SwitchConnection;
//# sourceMappingURL=switch.js.map