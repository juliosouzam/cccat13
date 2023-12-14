import { test, expect } from 'vitest'
import { Account } from '../../src/domain/entities/Account'

test('Deve validar a Account', () => {
  const account = new Account('', '', '', false, false, '')
  expect(account.validate().join(', ')).toBe('Invalid Name, Invalid Email, Invalid CPF')
})
