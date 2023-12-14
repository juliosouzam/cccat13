import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory';
import { AcceptRide } from '../../src/application/usecases/AcceptRide';
import { FinishRide } from '../../src/application/usecases/FinishRide';
import { GetRide } from '../../src/application/usecases/GetRide';
import { RequestRide } from '../../src/application/usecases/RequestRide';
import { SignUp } from '../../src/application/usecases/SignUp';
import { StartRide } from '../../src/application/usecases/StartRide';
import { UpdatePosition } from '../../src/application/usecases/UpdatePosition';
import { Connection } from '../../src/infra/database/Connection';
import { PgPromiseAdapter } from '../../src/infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from '../../src/infra/factory/DatabaseRepositoryFactory';

let signup: SignUp;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let getRide: GetRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
let connection: Connection;
let repositoryFactory: RepositoryFactory;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  repositoryFactory = new DatabaseRepositoryFactory(connection);
  signup = new SignUp(repositoryFactory);
  requestRide = new RequestRide(repositoryFactory);
  acceptRide = new AcceptRide(repositoryFactory);
  startRide = new StartRide(repositoryFactory);
  getRide = new GetRide(repositoryFactory);
  updatePosition = new UpdatePosition(repositoryFactory);
  finishRide = new FinishRide(repositoryFactory);
  vi.useFakeTimers();
});

afterEach(async () => {
  await connection.close();
  vi.useRealTimers();
});

test('Deve solicitar, aceitar, iniciar e atualizar a posição de uma corrida', async () => {
  const date = new Date('2023-12-05T10:00:00');
  vi.setSystemTime(date);

  const inputSignUpPassenger = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  const outputSignUpPassenger = await signup.execute(inputSignUpPassenger);
  // given
  const inputRequestRide = {
    passengerId: outputSignUpPassenger.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  // when
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputSignUpDriver = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: false,
    carPlate: 'AAA9999',
    isDriver: true,
    password: '',
  };
  const outputSignUpDriver = await signup.execute(inputSignUpDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignUpDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  };
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  };
  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  await finishRide.execute(inputFinishRide);
  // then
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('completed');
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(21);
});
