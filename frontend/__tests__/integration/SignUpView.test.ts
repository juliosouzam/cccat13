import { mount } from '@vue/test-utils'
import { test, expect, beforeEach, vi } from 'vitest'
import SignUpView from '../../src/views/SignUpView.vue'
import { RideGatewayHttp } from '../../src/infra/gateway/RideGatewayHttp'
import { RideGateway } from '../../src/infra/gateway/RideGateway'
import { FetchAdapter } from '../../src/infra/http/FetchAdapter'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let rideGateway: RideGateway
beforeEach(() => {
  rideGateway = {
    async signUp(input: any): Promise<any> {
      return { accountId: '8f268cc6-10eb-4f5f-8403-168e1e9c79cb' }
    },
    async requestRide(input) {
      return { rideId: '019cdf08-f8e6-40fd-95cd-c3fbaabcd654' }
    },
    async getRide(rideId: string) {
      return {
        status: 'requested',
        passengerId: 'b6fadb8a-542c-4f47-bf74-c2dfb652563d'
      }
    }
  }
})

test('Deve criar um passageiro', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new FetchAdapter())
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)
  expect(wrapper.get('.signup-account-id').text()).toHaveLength(36)
})

test('Deve criar um passageiro usando fake', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  expect(wrapper.get('.signup-account-id').text()).toHaveLength(36)
})

test('Não deve criar um passageiro com nome inválido usando fake', async () => {
  vi.spyOn(rideGateway, 'signUp').mockImplementation(() => {
    throw new Error('Invalid Name')
  })
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  expect(wrapper.get('.signup-error').text()).toBe('Invalid Name')
})

test('Não deve criar um passageiro se o cpf estiver inválido', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new FetchAdapter())
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-05')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)

  expect(wrapper.get('.signup-error').text()).toBe('Invalid CPF')
})

test('Não deve criar um passageiro se o nome estiver inválido', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new FetchAdapter())
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)

  expect(wrapper.get('.signup-error').text()).toBe('Invalid Name')
})

test('Não deve criar um passageiro se o email estiver inválido', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new FetchAdapter())
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)

  expect(wrapper.get('.signup-error').text()).toBe('Invalid Email')
})

test('Não deve criar um passageiro se o email estiver duplicado', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new FetchAdapter())
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(true)
  wrapper.get('.signup-is-driver').setValue(false)
  wrapper.get('.signup-car-plate').setValue('')
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)

  expect(wrapper.get('.signup-error').text()).toBe('Account already exists')
})

test('Deve criar um motorista', async () => {
  const wrapper = mount(SignUpView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new FetchAdapter())
      }
    }
  })
  expect(wrapper.get('.signup-title').text()).toBe('Sign Up')

  wrapper.get('.signup-name').setValue('John Doe')
  wrapper.get('.signup-email').setValue(`john${Math.random()}@doe.com`)
  wrapper.get('.signup-cpf').setValue('418.710.500-06')
  wrapper.get('.signup-is-passenger').setValue(false)
  wrapper.get('.signup-is-driver').setValue(true)
  wrapper.get('.signup-car-plate').setValue('AAA9999')
  await wrapper.get('.signup-submit').trigger('click')
  await sleep(200)
  expect(wrapper.get('.signup-account-id').text()).toHaveLength(36)
})
