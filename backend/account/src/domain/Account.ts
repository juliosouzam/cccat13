import crypto from 'node:crypto';

import { CarPlate } from './CarPlate';
import { Cpf } from './Cpf';
import { Email } from './Email';
import { Name } from './Name';
import { Password, PasswordFactory } from './Password';

export class Account {
  private constructor(
    readonly accountId: string,
    readonly name: Name,
    readonly email: Email,
    readonly cpf: Cpf,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate: CarPlate,
    readonly date: Date,
    readonly verificationCode: string,
    readonly password: Password
  ) {}

  static create(
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate: string,
    password: Password
  ) {
    const accountId = crypto.randomUUID();
    const date = new Date();
    const verificationCode = crypto.randomUUID();

    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      isPassenger,
      isDriver,
      new CarPlate(carPlate),
      date,
      verificationCode,
      password
    );
  }

  static restore(
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    isPassenger: boolean,
    isDriver: boolean,
    carPlate: string,
    date: Date,
    verificationCode: string,
    password: string,
    passwordAlgorithm: string,
    passwordSalt: string
  ) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      isPassenger,
      isDriver,
      new CarPlate(carPlate),
      date,
      verificationCode,
      PasswordFactory.create(passwordAlgorithm).restore(password, passwordSalt)
    );
  }
}
