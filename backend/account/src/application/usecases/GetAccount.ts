import { MailerGateway } from '../../infra/gateway/MailerGateway';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountRepository } from '../repositories/AccountRepository';

export class GetAccount {
  mailerGateway: MailerGateway;
  private accountRepository: AccountRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.mailerGateway = new MailerGateway();
    this.accountRepository = this.repositoryFactory.createAccountRepository();
  }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getById(accountId);
    if (!account) throw new Error('Account not found.');

    return {
      id: account.accountId,
      name: account.name.getValue(),
      email: account.email.getValue(),
      cpf: account.cpf.getValue(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
      carPlate: account.carPlate.getValue(),
    };
  }
}

type Output = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};
