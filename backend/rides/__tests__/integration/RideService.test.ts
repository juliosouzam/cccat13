import { afterEach, beforeEach, expect, test } from 'vitest';

import { RepositoryFactory } from '../../src/application/factory/RepositoryFactory';
import { AcceptRide } from '../../src/application/usecases/AcceptRide';
import { GetRide } from '../../src/application/usecases/GetRide';
import { RequestRide } from '../../src/application/usecases/RequestRide';
import { SignUp } from '../../src/application/usecases/SignUp';
import { StartRide } from '../../src/application/usecases/StartRide';
import { Connection } from '../../src/infra/database/Connection';
import { PgPromiseAdapter } from '../../src/infra/database/PgPromiseAdapter';
import { DatabaseRepositoryFactory } from '../../src/infra/factory/DatabaseRepositoryFactory';

let signup: SignUp;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let getRide: GetRide;
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
});

afterEach(async () => {
  await connection.close();
});

test('Deve solicitar uma corrida e receber a rideId', async () => {
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
  const outputSignUp = await signup.execute(inputSignUp);
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
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  // then
  expect(outputRequestRide.rideId).toBeDefined();
});

test('Deve solicitar e consultar uma corrida', async () => {
  const inputSignUp = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  const outputSignUp = await signup.execute(inputSignUp);
  // given
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
  };
  // when
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  // then
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('requested');
  expect(outputGetRide.passenger.accountId).toBe(outputSignUp.accountId);
  expect(outputGetRide.from.lat).toBe(inputRequestRide.from.lat);
  expect(outputGetRide.from.long).toBe(inputRequestRide.from.long);
  expect(outputGetRide.to.lat).toBe(inputRequestRide.to.lat);
  expect(outputGetRide.to.long).toBe(inputRequestRide.to.long);
  expect(outputGetRide.date).toBeDefined();
});

test('Deve solicitar uma corrida e aceitar a corrida', async () => {
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
  // then
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
  expect(outputGetRide.driverId).toBe(outputSignUpDriver.accountId);
});

test('Caso uma corrida seja solicitada por uma conta que não seja de passageiro, deve lançar um erro.', async () => {
  // given
  const inputSignUp = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    carPlate: 'AAA9999',
    isDriver: true,
    isPassenger: false,
    password: '',
  };
  // when
  const outputSignUp = await signup.execute(inputSignUp);
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
  };
  // then
  expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('Account is not from a Passenger')
  );
});

test('Caso uma corrida seja solicitada por um passageiro e ele já tenha uma corrida em andamento, lancar um error.', async () => {
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
  const outputSignUp = await signup.execute(inputSignUp);
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
  };
  await requestRide.execute(inputRequestRide);
  // then
  expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error('This passenger already has an active ride.')
  );
});

test('Não deve aceitar uma corrida e a conta não for motorista', async () => {
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
    isPassenger: true,
    isDriver: false,
    password: '',
    carPlate: '',
  };
  const outputSignUpDriver = await signup.execute(inputSignUpDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignUpDriver.accountId,
  };
  // then
  expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    new Error('Account is not from a Driver.')
  );
});

test('Não deve aceitar uma corrida se o status da corrida não for requested', async () => {
  const inputSignUpPassenger = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    password: '',
    carPlate: '',
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
    isDriver: true,
    carPlate: 'AAA9999',
    isPassenger: false,
    password: '',
  };
  const outputSignUpDriver = await signup.execute(inputSignUpDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignUpDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  // then
  expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    new Error('Invalid Status.')
  );
});

test('Não deve aceitar uma corrida se o motorista já tiver outra corrida em andamento', async () => {
  const inputSignUpPassenger1 = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  const outputSignUpPassenger1 = await signup.execute(inputSignUpPassenger1);
  // given
  const inputRequestRide1 = {
    passengerId: outputSignUpPassenger1.accountId,
    from: {
      lat: -27.584905257808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const inputSignUpPassenger2 = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '',
  };
  const outputSignUpPassenger2 = await signup.execute(inputSignUpPassenger2);
  // given
  const inputRequestRide2 = {
    passengerId: outputSignUpPassenger2.accountId,
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
  const outputRequestRide1 = await requestRide.execute(inputRequestRide1);
  const outputRequestRide2 = await requestRide.execute(inputRequestRide2);
  const inputSignUpDriver = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isDriver: true,
    carPlate: 'AAA9999',
    isPassenger: false,
    password: '',
  };
  const outputSignUpDriver = await signup.execute(inputSignUpDriver);
  const inputAcceptRide1 = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignUpDriver.accountId,
  };
  const inputAcceptRide2 = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignUpDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide1);
  // then
  expect(() => acceptRide.execute(inputAcceptRide2)).rejects.toThrow(
    new Error('Driver in already in another ride.')
  );
});

test('Deve solicitar, aceitar e iniciar uma corrida', async () => {
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
  // then
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('in_progress');
  expect(outputGetRide.driverId).toBe(outputSignUpDriver.accountId);
});
