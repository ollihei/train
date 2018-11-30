import { Switch } from "./switch";
import { Coordinate } from "./coordinate";

export class Track {

  private coordinate1: Coordinate;
  private coordinate2: Coordinate;

  private switch: Switch;

  public setCoordinate1(coordinate1: Coordinate): void {
    this.coordinate1 = coordinate1;
  }

  public setCoordinate2(coordinate2: Coordinate): void {
    this.coordinate2 = coordinate2;
  }

  public getCoordinate1(): Coordinate {
    return this.coordinate1;
  }

  public getCoordinate2(): Coordinate {
    return this.coordinate2;
  }

  public setSwitch(switchToBeSet: Switch): void {
    this.switch = switchToBeSet;
  }
}
