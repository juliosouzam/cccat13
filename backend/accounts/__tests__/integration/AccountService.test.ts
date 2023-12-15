import sinon from 'sinon';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory';
import { GetAccount } from '../../src/application/usecases/GetAccount';
import { SignUp } from '../../src/application/usecases/SignUp';
import { Account } from '../../src/domain/Account';
import { CarPlate } from '../../src/domain/CarPlate';
import { Cpf } from '../../src/domain/Cpf';
import { Email } from '../../src/domain/Email';
import { Name } from '../../src/domain/Name';
import { PlainPassword } from '../../src/domain/Password';
import { Connection } from '../../src/infra/database/Connection';
import { PgPromiseAdapter } from '../../src/infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from '../../src/infra/factory/DatabaseRepositoryFactory';
import { MemoryRepositoryFactory } from '../../src/infra/factory/MemoryRepositoryFactory';
import { Queue } from '../../src/infra/queue/Queue';
import { RabbitMQAdapter } from '../../src/infra/queue/RabbitMQAdapter';
import { AccountRepositoryDatabase } from '../../src/infra/repositories/AccountRepositoryDatabase';
import { AccountRepositoryMemory } from '../../src/infra/repositories/AccountRepositoryMemory';

vi.mock('crypto', async (importOriginal) => {
  const mod = await importOriginal<typeof import('node:crypto')>();
  return {
    ...mod,
    randomUUID: vi.fn().mockReturnValue('uuid'),
  };
});

let connection: Connection;
let signup: SignUp;
let getAccount: GetAccount;
let repositoryFactory: RepositoryFactory;
let queue: Queue;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  queue = new RabbitMQAdapter();
  repositoryFactory = new DatabaseRepositoryFactory(connection);
  signup = new SignUp(repositoryFactory, queue);
  getAccount = new GetAccount(repositoryFactory);
});

afterEach(async () => {
  sinon.restore();
  await connection.close();
});

test('Deve criar um passageiro', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  const output = await signup.execute(input);
  // then
  const account = await getAccount.execute(output.accountId);
  expect(output.accountId).toBe(account.id);
  expect(account.name).toBe(input.name);
  expect(account.email).toBe(input.email);
  expect(account.cpf).toBe(input.cpf.replace(/\D/g, ''));
});

test('Não deve criar um passageiro com CPF inválido', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-00',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  // then
  expect(() => signup.execute(input)).rejects.toThrow(new Error('Invalid CPF'));
});

test('Não deve criar um passageiro com nome inválido', async () => {
  // given
  const input = {
    name: 'John',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    password: '',
    carPlate: '',
  };
  // when
  // then
  expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid Name')
  );
});

test('Não deve criar um passageiro com email inválido', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  // then
  expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid Email')
  );
});

test('Não deve criar um passageiro com conta existente', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  await signup.execute(input);
  // then
  expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Account already exists')
  );
});

test('Deve criar um motorista', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    carPlate: 'AAA9999',
    isDriver: true,
    isPassenger: false,
    password: '',
  };
  // when
  const output = await signup.execute(input);
  // then
  expect(output.accountId).toBeDefined();
});

test('Não deve criar um motorista com placa do carro inválido', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    carPlate: 'AAA999',
    isDriver: true,
    isPassenger: false,
    password: '',
  };
  // when
  // then
  expect(() => signup.execute(input)).rejects.toThrow(
    new Error('Invalid Plate')
  );
});

test('Deve criar um passageiro com stub', async () => {
  sinon.stub(AccountRepositoryDatabase.prototype, 'save').resolves();
  sinon.stub(AccountRepositoryDatabase.prototype, 'getByEmail').resolves();
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  const output = await signup.execute(input);
  // then
  sinon
    .stub(AccountRepositoryDatabase.prototype, 'getById')
    .resolves(
      Account.restore(
        output.accountId,
        input.name,
        input.email,
        input.cpf,
        input.isPassenger,
        false,
        '',
        new Date(),
        '',
        '',
        'plain',
        ''
      )
    );
  const account = await getAccount.execute(output.accountId);
  expect(output.accountId).toBe(account.id);
  expect(account.name).toBe(input.name);
  expect(account.email).toBe(input.email);
  expect(account.cpf).toBe(input.cpf.replace(/\D/g, ''));
});

test('Deve criar um passageiro com spy', async () => {
  const spy = sinon.spy(queue, 'publish');
  sinon.stub(AccountRepositoryDatabase.prototype, 'save').resolves();
  sinon.stub(AccountRepositoryDatabase.prototype, 'getByEmail').resolves();
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  await signup.execute(input);
  // then

  sinon
    .stub(AccountRepositoryDatabase.prototype, 'getById')
    .resolves(
      Account.create(
        input.name,
        input.email,
        input.cpf,
        input.isPassenger,
        false,
        '',
        PlainPassword.create('')
      )
    );
  expect(spy.calledOnce).toBeTruthy();
  expect(
    spy.calledWith('send.notification', {
      type: 'EMAIL',
      payload: {
        to: input.email,
        subject: 'Verification',
        message: `Please verify your code at first login ${input.email}`,
      },
    })
  ).toBeTruthy();
});

test('Deve criar um passageiro com mock', async () => {
  const mockAccountDAO = sinon.mock(AccountRepositoryDatabase.prototype);
  mockAccountDAO.expects('save').resolves();
  mockAccountDAO.expects('getByEmail').resolves();
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  const mock = sinon.mock(RabbitMQAdapter.prototype);
  mock.expects('publish').withArgs('send.notification', {
    type: 'EMAIL',
    payload: {
      to: input.email,
      subject: 'Verification',
      message: `Please verify your code at first login ${input.email}`,
    },
  }).calledOnce;
  // when
  const output = await signup.execute(input);
  // then
  mockAccountDAO.expects('getById').resolves({
    ...{
      ...input,
      name: new Name(input.name),
      email: new Email(input.email),
      cpf: new Cpf(input.cpf),
      carPlate: new CarPlate(input.carPlate),
    },
    id: output.accountId,
  });
  await getAccount.execute(output.accountId);
  mock.verify();
});

test('Deve criar um passageiro com fake', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  const repositoryFactory = new MemoryRepositoryFactory();
  queue = {
    async publish(queue: string, payload: any): Promise<void> {},
    async consume(queue: string, callback: Function): Promise<void> {},
  };
  vi.spyOn(
    MemoryRepositoryFactory.prototype,
    'createAccountRepository'
  ).mockReturnValue(new AccountRepositoryMemory());
  const signup = new SignUp(repositoryFactory, queue);
  const output = await signup.execute(input);
  // then
  const getAccount = new GetAccount(repositoryFactory);
  const account = await getAccount.execute(output.accountId);
  expect(output.accountId).toBe(account.id);
  expect(account.name).toBe(input.name);
  expect(account.email).toBe(input.email);
  expect(account.cpf).toBe(input.cpf.replace(/\D/g, ''));
});
