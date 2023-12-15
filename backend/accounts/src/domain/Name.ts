export class Name {
  private value: string;

  constructor(name: string) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid Name');
    this.value = name;
  }

  public getValue() {
    return this.value;
  }
}
