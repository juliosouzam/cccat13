export class Email {
  private value: string;

  constructor(email: string) {
    if (!email.match(/^(.+)@(.+)$/)) throw new Error('Invalid Email');
    this.value = email.trim().toLocaleLowerCase();
  }

  public getValue() {
    return this.value;
  }
}
