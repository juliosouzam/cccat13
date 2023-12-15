import { TokenGenerator } from '../../domain/TokenGenerator';
import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountRepository } from '../repositories/AccountRepository';

export class Authenticate {
  private accountRepository: AccountRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.accountRepository = this.repositoryFactory.createAccountRepository();
  }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getByEmail(input.email);
    if (!account) throw new Error('Authentication failed.');
    if (!(await account.password.validate(input.password)))
      throw new Error('Authentication failed.');
    const token = TokenGenerator.generate(account);

    return {
      token,
    };
  }
}

type Input = {
  email: string;
  password: string;
};

type Output = {
  token: string;
};
