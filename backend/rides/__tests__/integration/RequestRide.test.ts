import { afterEach, beforeEach, expect, test } from 'vitest';

import { AuthenticationDecorator } from '../../src/application/decorator/AuthenticationDecorator';
import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory';
import { AccountGateway } from '../../src/application/gateway/AccountGateway';
import { RequestRide } from '../../src/application/usecases/RequestRide';
import { Usecase } from '../../src/application/usecases/Usecase';
import { Connection } from '../../src/infra/database/Connection';
import { PgPromiseAdapter } from '../../src/infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from '../../src/infra/factory/DatabaseRepositoryFactory';
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp';
import { FetchAdapter } from '../../src/infra/http/FetchAdapter';

let accountGateway: AccountGateway;
let requestRide: Usecase;
let connection: Connection;
let repositoryFactory: RepositoryFactory;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  repositoryFactory = new DatabaseRepositoryFactory(connection);
  accountGateway = new AccountGatewayHttp(new FetchAdapter());
  requestRide = new AuthenticationDecorator(
    new RequestRide(repositoryFactory, accountGateway),
    accountGateway
  );
});

afterEach(async () => {
  await connection.close();
});

test.only('Deve solicitar uma corrida e receber a rideId', async () => {
  // given
  const inputSignUp = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  // when
  const outputSignUp = await accountGateway.signUp(inputSignUp);
  const inputRequestRide = {
    passengerId: outputSignUp.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI0MTg3MTA1MDAwNiIsImlhdCI6MTcwMjA4MzYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDAwMH0.ppLtWlVf-SknHPATgqhGIu0V1NT5vEc8VlUlkRK_bUQ',
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  // then
  expect(outputRequestRide.rideId).toBeDefined();
});
