import { expect, test } from 'vitest';
import { AccountGatewayHttp } from '../../src/infra/gateway/AccountGatewayHttp';
import { FetchAdapter } from '../../src/infra/http/FetchAdapter';

test('Deve criar uma conta de passageiro', async () => {
  const httpClient = new FetchAdapter();
  const accountGateway = new AccountGatewayHttp(httpClient);
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    password: '1234567',
  };
  // when
  const outputSignup = await accountGateway.signUp(input);
  // then
  const responseGetAccount = await accountGateway.getById(
    outputSignup.accountId
  );
  // const outputGetAccount = responseGetAccount.data;
  expect(responseGetAccount.id).toBe(outputSignup.accountId);
  expect(responseGetAccount.name).toBe(input.name);
  expect(responseGetAccount.email).toBe(input.email);
  expect(responseGetAccount.cpf).toBe(input.cpf.replace(/\D/g, ''));
});
