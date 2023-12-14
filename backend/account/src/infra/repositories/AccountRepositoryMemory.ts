import { AccountRepository } from '../../application/repositories/AccountRepository';
import { Account } from '../../domain/Account';

export class AccountRepositoryMemory implements AccountRepository {
  accounts: Map<string, Account>;

  constructor() {
    this.accounts = new Map<string, Account>();
  }

  async save(account: Account): Promise<void> {
    this.accounts.set(account.accountId, account);
  }

  async getByEmail(email: string): Promise<any> {
    for (const [, account] of this.accounts.entries()) {
      if (account.email.getValue() === email) return account;
    }

    return undefined;
  }

  async getById(accountId: string): Promise<any> {
    return this.accounts.get(accountId);
  }
}
