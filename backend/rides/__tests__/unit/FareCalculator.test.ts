import { test, expect } from 'vitest';
import { FareCalculatorFactory } from '../../src/domain/FareCalculator';

test('Deve calcular o valor da tarifa com base na distância', () => {
  const distance = 10;
  const fare = FareCalculatorFactory.create(
    new Date('2023-12-05T10:00:00')
  ).calculate(distance);

  expect(fare).toBe(21);
});

test('Deve calcular o valor da tarifa a noite com base na distância', () => {
  const distance = 10;
  const fare = FareCalculatorFactory.create(
    new Date('2023-12-05T03:00:00')
  ).calculate(distance);

  expect(fare).toBe(50);
});
