import { mount } from '@vue/test-utils'
import { test, expect, beforeEach, vi } from 'vitest'
import RequestRideView from '../../src/views/RequestRideView.vue'
import SignUpView from '../../src/views/SignUpView.vue'
import GetRideView from '../../src/views/GetRideView.vue'
import { RideGateway } from '../../src/infra/gateway/RideGateway'
import { GeolocationGateway } from '../../src/infra/gateway/GeolocationGateway'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
let rideGateway: RideGateway
let geolocationGateway: GeolocationGateway
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
        passengerId: 'b6fadb8a-542c-4f47-bf74-c2dfb652563d',
        passenger: {
          name: '',
          email: '',
          cpf: ''
        }
      }
    }
  }
  geolocationGateway = {
    async getGeolocation() {
      return {
        lat: 0,
        logn: 0
      }
    }
  }
})

test('Deve solicitar uma corrida', async () => {
  const wrapperSignUpView = mount(SignUpView, { global: { provide: { rideGateway } } })
  const passenger = {
    name: 'John Doe',
    email: `john${Math.random()}@doe.com`,
    cpf: '41871050006'
  }
  wrapperSignUpView.get('.signup-name').setValue(passenger.name)
  wrapperSignUpView.get('.signup-email').setValue(passenger.email)
  wrapperSignUpView.get('.signup-cpf').setValue(passenger.cpf)
  wrapperSignUpView.get('.signup-is-passenger').setValue(true)
  wrapperSignUpView.get('.signup-is-driver').setValue(false)
  wrapperSignUpView.get('.signup-car-plate').setValue('')
  await wrapperSignUpView.get('.signup-submit').trigger('click')
  const accountId = wrapperSignUpView.get('.signup-account-id').text()

  const wrapperRequestRideView = mount(RequestRideView, { global: { provide: { rideGateway, geolocationGateway } } })
  expect(wrapperRequestRideView.get('.request-ride-title').text()).toBe('Request Ride')
  wrapperRequestRideView.get('.request-ride-passenger-id').setValue(accountId)
  wrapperRequestRideView.get('.request-ride-to-lat').setValue(-27.496887588317275)
  wrapperRequestRideView.get('.request-ride-to-long').setValue(-48.522234807851476)
  wrapperRequestRideView.get('.request-ride-from-lat').setValue(-27.584905257808835)
  wrapperRequestRideView.get('.request-ride-from-long').setValue(-48.545022195325124)
  await wrapperRequestRideView.get('.request-ride-submit').trigger('click')
  expect(wrapperRequestRideView.get('.request-ride-ride-id').text()).toHaveLength(36)
  const rideId = wrapperRequestRideView.get('.request-ride-ride-id').text()

  vi.spyOn(rideGateway, 'getRide').mockResolvedValue({
    status: 'requested',
    passengerId: 'b6fadb8a-542c-4f47-bf74-c2dfb652563d',
    passenger: {
      name: passenger.name,
      email: passenger.email,
      cpf: passenger.cpf
    }
  })
  const wrapperGetRideView = mount(GetRideView, { global: { provide: { rideGateway } } })
  wrapperGetRideView.get('.get-ride-ride-id').setValue(rideId)
  await wrapperGetRideView.get('.get-ride-submit').trigger('click')
  await sleep(1)
  expect(wrapperGetRideView.get('.get-ride-status').text()).toBeDefined()
  expect(wrapperGetRideView.get('.get-ride-status').text()).toBe('requested')
  expect(wrapperGetRideView.get('.get-ride-passenger-id').text()).toHaveLength(36)
  expect(wrapperGetRideView.get('.get-ride-passenger-name').text()).toBe(passenger.name)
  expect(wrapperGetRideView.get('.get-ride-passenger-email').text()).toBe(passenger.email)
  expect(wrapperGetRideView.get('.get-ride-passenger-cpf').text()).toBe(passenger.cpf)
})
