import { sign, verify } from 'jsonwebtoken';
import { Account } from './Account';

export class TokenGenerator {
  private static SECRET = 'secret';

  static generate(account: Account, date: Date = new Date()) {
    const token = sign(
      {
        cpf: account.cpf.getValue(),
        iat: date.getTime(),
        expiresIn: 10 ** 10,
      },
      this.SECRET
    );

    return token;
  }

  static verify(token: string): any {
    const payload = verify(token, this.SECRET);

    return payload;
  }
}
