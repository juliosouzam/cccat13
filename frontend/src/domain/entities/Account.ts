import { CpfValidator } from './CpfValidator'

export class Account {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate: string
  ) {}

  validate() {
    const errors: string[] = []
    if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) errors.push('Invalid Name')
    if (!this.email.match(/^(.+)@(.+)$/)) errors.push('Invalid Email')
    if (!CpfValidator.validate(this.cpf)) errors.push('Invalid CPF')
    if (this.isDriver && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) errors.push('Invalid Plate')

    return errors
  }
}
