import { Route } from "./route";

export class Switch {

  private switchConnections: SwitchConnection[] = [];
  private location: string;
  
  constructor(location: string) {
    this.location = location;
  }

  public addSwitchConnection(state: number, route1: Route, route2: Route): void {
    this.switchConnections.push({
      route1: route1,
      route2: route2,
      state: state
    });
  }
}

export class SwitchConnection {
  route1: Route;
  route2: Route;
  state: number;
}
