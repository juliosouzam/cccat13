import { afterEach, beforeEach, expect, test } from 'vitest';

import { AccountRepository } from '../../src/application/repositories/AccountRepository';
import { Account } from '../../src/domain/Account';
import { PlainPassword } from '../../src/domain/Password';
import { Connection } from '../../src/infra/database/Connection';
import { PgPromiseAdapter } from '../../src/infra/database/PgPromiseAdapter';
import { AccountRepositoryDatabase } from '../../src/infra/repositories/AccountRepositoryDatabase';

let accountRepository: AccountRepository;
let connection: Connection;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
});

test('Deve criar um registro na tabela accounts e consultar por email', async () => {
  const account = Account.create(
    'John Doe',
    `john${Math.random()}@doe.com`,
    '418.710.500-06',
    true,
    false,
    '',
    PlainPassword.create('')
  );
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getByEmail(
    account.email.getValue()
  );
  expect(savedAccount?.accountId).toBeDefined();
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue());
  expect(savedAccount?.email.getValue()).toBe(account.email.getValue());
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue());
  expect(savedAccount?.isPassenger).toBeTruthy();
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
});

test('Deve criar um registro na tabela accounts e consultar por account_id', async () => {
  const account = Account.create(
    'John Doe',
    `john${Math.random()}@doe.com`,
    '418.710.500-06',
    true,
    false,
    '',
    PlainPassword.create('')
  );
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getById(account.accountId);
  expect(savedAccount?.accountId).toBeDefined();
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue());
  expect(savedAccount?.email.getValue()).toBe(account.email.getValue());
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue());
  expect(savedAccount?.isPassenger).toBeTruthy();
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
});

afterEach(async () => {
  await connection.close();
});
