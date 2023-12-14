import { Account } from '../../domain/Account';
import { Argon2Password } from '../../domain/Password';
import { MailerGateway } from '../../infra/gateway/MailerGateway';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountRepository } from '../repositories/AccountRepository';

export class SignUp {
  mailerGateway: MailerGateway;
  private accountRepository: AccountRepository;

  constructor(private repositoryFactory: RepositoryFactory) {
    this.mailerGateway = new MailerGateway();
    this.accountRepository = this.repositoryFactory.createAccountRepository();
  }

  async execute(input: Input) {
    const existingAccount = await this.accountRepository.getByEmail(
      input.email
    );
    if (existingAccount) throw new Error('Account already exists');
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
      await Argon2Password.create(input.password)
    );
    await this.accountRepository.save(account);
    await this.mailerGateway.send(
      account.email.getValue(),
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`
    );

    return {
      accountId: account.accountId,
    };
  }
}

type Input = {
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  isDriver: boolean;
  carPlate: string;
  password: string;
};
