import { RepositoryFactory } from '../../application/factory/RepositoryFactory';
import { AccountRepository } from '../../application/repositories/AccountRepository';
import { AccountRepositoryMemory } from '../repositories/AccountRepositoryMemory';

export class MemoryRepositoryFactory implements RepositoryFactory {
  createAccountRepository(): AccountRepository {
    return new AccountRepositoryMemory();
  }
}
