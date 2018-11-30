"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const track_1 = require("../trainObjects/track");
const route_1 = require("../trainObjects/route");
const coordinate_1 = require("../trainObjects/coordinate");
const switch_1 = require("../trainObjects/switch");
const train_1 = require("../trainObjects/train");
class NetworkStatic {
    constructor(specification) {
        this.mapRoutes = new Map();
        this.mapSwitchesByCoordinate = new Map();
        this.mapTrains = new Map();
        this.init(specification);
    }
    /**
    * Returns train as list.
    */
    getTrains() {
        const trains = [];
        this.mapTrains.forEach((train) => {
            trains.push(train);
        });
        return trains;
    }
    /**
    * Returns routes as list.
    */
    getRoutes() {
        const routes = [];
        this.mapRoutes.forEach((route) => {
            routes.push(route);
        });
        return routes;
    }
    /**
    * Returns train as list.
    */
    getSwitches() {
        const switches = [];
        this.mapSwitchesByCoordinate.forEach((switchToBeAdded) => {
            console.log('kiertää: ' + this.mapSwitchesByCoordinate.size);
            switches.push(switchToBeAdded);
        });
        return switches;
    }
    init(specification) {
        // const setRoutes: Set<string> = new Set<string>();
        // const setTracks: Set<Track> = new Set<Track>();
        // Create empty routes
        for (const part of specification.network) {
            if (this.mapRoutes.has(part.route))
                continue;
            this.mapRoutes.set(part.route, new route_1.Route(part.route));
        }
        // Creates switches
        for (const switchInSpecification of specification.swhitches) {
            console.log('Vaihde: ' + JSON.stringify(switchInSpecification));
            const switchToBeAdded = new switch_1.Switch(switchInSpecification.location);
            for (const switchConnection of switchInSpecification.connections) {
                switchToBeAdded.addSwitchConnection(switchConnection.state, this.mapRoutes.get(switchConnection.route1), this.mapRoutes.get(switchConnection.route2));
            }
            console.log('add switch');
            this.mapSwitchesByCoordinate.set(this.getLocationAsCoordinate(switchInSpecification.location).getAsString(), switchToBeAdded);
        }
        console.log('koko: ' + this.mapSwitchesByCoordinate.size);
        // Add tracks to routes
        for (const part of specification.network) {
            const route = this.mapRoutes.get(part.route);
            // Go trough tracks
            // Ignore the last because it included into second last track
            for (let i = 0; i < part.tracks.length - 1; i++) {
                const trackString = part.tracks[i];
                const trackStringNext = part.tracks[i + 1];
                const trackToBeAdded = new track_1.Track();
                route.addTrack(trackToBeAdded);
                const coordinateFirst = this.getLocationAsCoordinate(trackString);
                const coordinateNext = this.getLocationAsCoordinate(trackStringNext);
                trackToBeAdded.setCoordinate1(coordinateFirst);
                trackToBeAdded.setCoordinate2(coordinateNext);
                if (this.mapSwitchesByCoordinate.has(coordinateFirst.getAsString())) {
                    trackToBeAdded.setSwitch(this.mapSwitchesByCoordinate.get(coordinateFirst.getAsString()));
                }
                if (this.mapSwitchesByCoordinate.has(coordinateNext.getAsString())) {
                    trackToBeAdded.setSwitch(this.mapSwitchesByCoordinate.get(coordinateNext.getAsString()));
                }
            }
        }
        // Create trainSpecification
        for (const train of specification.trains) {
            const trainToBeAdded = new train_1.Train(train.id, train.tag1, train.tag2);
            this.mapTrains.set(trainToBeAdded.getId(), trainToBeAdded);
        }
    }
    /**
     * Converts location (1,4) to coordinate.
     */
    getLocationAsCoordinate(location) {
        const coordinateArray = location.split(',');
        return new coordinate_1.Coordinate(Number.parseInt(coordinateArray[0]), Number.parseInt(coordinateArray[1]));
    }
}
exports.NetworkStatic = NetworkStatic;
//# sourceMappingURL=networkStatic.js.map