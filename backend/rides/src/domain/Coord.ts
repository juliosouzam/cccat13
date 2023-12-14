export class Coord {
  private lat: number;
  private long: number;

  constructor(lat: number, long: number) {
    if (lat < -180 || lat > 90) throw new Error('Invalid latitude');
    if (long < -180 || long > 180) throw new Error('Invalid longitude');
    this.lat = lat;
    this.long = long;
  }

  public getLat() {
    return this.lat;
  }

  public getLong() {
    return this.long;
  }
}
