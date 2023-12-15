import axios from 'axios';
import { expect, test } from 'vitest';

test('Deve criar uma conta de passageiro', async () => {
  // given
  const input = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '418.710.500-06',
    isPassenger: true,
    password: '1234567',
  };
  // when
  const responseSignup = await axios.post(
    'http://localhost:3333/signup',
    input
  );
  const outputSignup = responseSignup.data;
  // then
  const responseGetAccount = await axios.get(
    `http://localhost:3333/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.id).toBe(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf.replace(/\D/g, ''));
});
