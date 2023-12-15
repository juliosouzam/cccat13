import { test, expect } from 'vitest';
import { Cpf } from '../../src/domain/Cpf';

test.each([
  '142.052.710-00',
  '418.710.500-06',
  '011.329.670-31',
  '127.982.590-10',
  '36667354013',
  '86576391064',
])('Deve validar um CPF %s', (cpf) => {
  expect(new Cpf(cpf).getValue()).toBeDefined();
});

test.each([
  '418.710.500-00',
  '127.982.590-20',
  '36667354014',
  '86576391063',
  '865763910',
  '86576391063111',
  '865763',
  '11111111111',
  '',
])('Não deve validar um CPF %s', (cpf) => {
  expect(() => new Cpf(cpf)).toThrow(new Error('Invalid CPF'));
});
