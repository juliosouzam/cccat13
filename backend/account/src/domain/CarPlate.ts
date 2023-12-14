export class CarPlate {
  private value: string;

  constructor(carPlate: string) {
    if (carPlate && !carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error('Invalid Plate');
    this.value = carPlate;
  }

  public getValue() {
    return this.value;
  }
}
