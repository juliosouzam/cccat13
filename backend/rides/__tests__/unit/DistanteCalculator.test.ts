import { test, expect } from 'vitest';
import { Coord } from '../../src/domain/Coord';
import { DistanteCalculator } from '../../src/domain/DistanteCalculator';

test('Deve calcular a distância entre duas coordenadas.', () => {
  const from = new Coord(-27.584905257808835, -48.545022195325124);
  const to = new Coord(-27.496887588317275, -48.522234807851476);

  const distance = DistanteCalculator.calculate(from, to);
  expect(distance).toBe(10);
});

