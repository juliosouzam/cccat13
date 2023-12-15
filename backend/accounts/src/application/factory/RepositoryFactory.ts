import { AccountRepository } from '../repositories/AccountRepository';

export interface RepositoryFactory {
  createAccountRepository(): AccountRepository;
}
