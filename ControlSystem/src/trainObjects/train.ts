export class Train {

  private id: number;
  private tagFront: string;
  private tagBack: string;

  constructor(id: number, tagFront: string, tagBack: string) {
    this.id = id;
    this.tagFront = tagFront;
    this.tagBack = tagBack;
  }

  public getId(): number {
    return this.id;
  }

  public getTagFront(): string {
    return this.tagFront;
  }

  public getTagBack(): string {
    return this.tagBack;
  }
}
