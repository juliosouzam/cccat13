import { sign } from 'jsonwebtoken';
import { Account } from './Account';

export class TokenGenerator {
  static generate(account: Account, date: Date = new Date()) {
    const token = sign(
      {
        cpf: account.cpf.getValue(),
        iat: date.getTime(),
        expiresIn: 10 ** 10,
      },
      'secret'
    );

    return token;
  }
}
