import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory';
import { Authenticate } from '../../src/application/usecases/Authenticate';
import { SignUp } from '../../src/application/usecases/SignUp';
import { Connection } from '../../src/infra/database/Connection';
import { PgPromiseAdapter } from '../../src/infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from '../../src/infra/factory/DatabaseRepositoryFactory';
import { Queue } from '../../src/infra/queue/Queue';
import { RabbitMQAdapter } from '../../src/infra/queue/RabbitMQAdapter';

let signup: SignUp;
let authenticate: Authenticate;
let connection: Connection;
let repositoryFactory: RepositoryFactory;
let queue: Queue;

beforeEach(() => {});

afterEach(() => {});

beforeEach(() => {
  vi.useFakeTimers();
  connection = new PgPromiseAdapter();
  queue = new RabbitMQAdapter();
  repositoryFactory = new DatabaseRepositoryFactory(connection);
  signup = new SignUp(repositoryFactory, queue);
  authenticate = new Authenticate(repositoryFactory);
});

afterEach(async () => {
  vi.useRealTimers();
  await connection.close();
});

test('Deve autenticar o login', async () => {
  const date = new Date('2023-12-08T22:00:00');
  vi.setSystemTime(date);
  const inputSignup = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '123456',
  };
  // when
  await signup.execute(inputSignup);
  const inputLogin = {
    email: inputSignup.email,
    password: inputSignup.password,
  };
  const output = await authenticate.execute(inputLogin);
  // then
  expect(output.token).toBeDefined();
  expect(output.token).toBe(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI0MTg3MTA1MDAwNiIsImlhdCI6MTcwMjA4MzYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDAwMH0.ppLtWlVf-SknHPATgqhGIu0V1NT5vEc8VlUlkRK_bUQ'
  );
});
