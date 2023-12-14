import { RepositoryFactory } from '../../application/factory/RepositoryFactory';
import { AccountRepository } from '../../application/repositories/AccountRepository';
import { Connection } from '../database/Connection';
import { AccountRepositoryDatabase } from '../repositories/AccountRepositoryDatabase';

export class DatabaseRepositoryFactory implements RepositoryFactory {
  constructor(private readonly connection: Connection) {}

  createAccountRepository(): AccountRepository {
    return new AccountRepositoryDatabase(this.connection);
  }
}
