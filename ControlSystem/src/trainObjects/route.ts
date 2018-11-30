import { Track } from "./track";

export class Route {

  private tracks: Track[] =[];
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  addTrack(track: Track): void {
    this.tracks.push(track);
  }
}
