import { TrainSpecification } from "../interfaces/trainSpecification";
import { Track } from "../trainObjects/track";
import { Route } from "../trainObjects/route";
import { Coordinate } from "../trainObjects/coordinate";
import { Switch } from "../trainObjects/switch";
import { Train } from "../trainObjects/train";

export class NetworkStatic {

  private mapRoutes: Map<string, Route> = new Map<string, Route>();
  private mapSwitchesByCoordinate: Map<string, Switch> = new Map<string, Switch>();
  private mapTrains: Map<number, Train> = new Map<number, Train>();

  constructor(specification: TrainSpecification) {
    this.init(specification);
  }

  /**
  * Returns train as list.
  */
  public getTrains(): Train[] {
    const trains: Train[] = [];
    this.mapTrains.forEach((train: Train) => {
      trains.push(train);
    });
    return trains;
  }

  /**
  * Returns routes as list.
  */
  public getRoutes(): Route[] {
    const routes: Route[] = [];
    this.mapRoutes.forEach((route: Route) => {
      routes.push(route);
    });
    return routes;
  }

  /**
  * Returns train as list.
  */
  public getSwitches(): Switch[] {
    const switches: Switch[] = [];
    this.mapSwitchesByCoordinate.forEach((switchToBeAdded: Switch) => {
      console.log('kiertää: '+ this.mapSwitchesByCoordinate.size);
      switches.push(switchToBeAdded);
    });
    return switches;
  }

  private init(specification: TrainSpecification) {

    // const setRoutes: Set<string> = new Set<string>();
    // const setTracks: Set<Track> = new Set<Track>();



    // Create empty routes
    for (const part of specification.network) {
      if (this.mapRoutes.has(part.route)) continue;
      this.mapRoutes.set(part.route, new Route(part.route));
    }

    // Creates switches
    for (const switchInSpecification of specification.swhitches) {
      console.log('Vaihde: ' + JSON.stringify(switchInSpecification));
      const switchToBeAdded: Switch = new Switch(switchInSpecification.location);
      for (const switchConnection of switchInSpecification.connections) {
        switchToBeAdded.addSwitchConnection(
          switchConnection.state,
          this.mapRoutes.get(switchConnection.route1),
          this.mapRoutes.get(switchConnection.route2),
        )
      }
      console.log('add switch');
      this.mapSwitchesByCoordinate.set(
        this.getLocationAsCoordinate(switchInSpecification.location).getAsString(),
        switchToBeAdded);
    }
          console.log('koko: '+ this.mapSwitchesByCoordinate.size);

    // Add tracks to routes
    for (const part of specification.network) {
      const route: Route = this.mapRoutes.get(part.route);

      // Go trough tracks
      // Ignore the last because it included into second last track
      for (let i = 0; i < part.tracks.length - 1; i++) {
        const trackString = part.tracks[i];
        const trackStringNext = part.tracks[i + 1];

        const trackToBeAdded: Track = new Track();
        route.addTrack(trackToBeAdded);

        const coordinateFirst: Coordinate = this.getLocationAsCoordinate(trackString);
        const coordinateNext: Coordinate = this.getLocationAsCoordinate(trackStringNext)
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
      const trainToBeAdded: Train = new Train(train.id, train.tag1, train.tag2);
      this.mapTrains.set(trainToBeAdded.getId(), trainToBeAdded);
    }
  }

  /**
   * Converts location (1,4) to coordinate.
   */
  private getLocationAsCoordinate(location: string): Coordinate {
    const coordinateArray: string[] = location.split(',');
    return new Coordinate(
      Number.parseInt(coordinateArray[0]),
      Number.parseInt(coordinateArray[1]));
  }

}
