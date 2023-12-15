import { Account } from '../../domain/Account';
import { Argon2Password } from '../../domain/Password';
import { Queue } from '../../infra/queue/Queue';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountRepository } from '../repositories/AccountRepository';

export class SignUp {
  private accountRepository: AccountRepository;

  constructor(
    private repositoryFactory: RepositoryFactory,
    private readonly queue: Queue
  ) {
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
    await this.queue.publish('send.notification', {
      type: 'EMAIL',
      payload: {
        to: account.email.getValue(),
        subject: 'Verification',
        message: `Please verify your code at first login ${account.email.getValue()}`,
      },
    });

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
