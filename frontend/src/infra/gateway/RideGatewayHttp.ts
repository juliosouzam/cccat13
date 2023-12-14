import type { RideGateway, SignUpOutput } from './RideGateway'
import type { HttpClient } from '../http/HttpClient'
import type { Account } from '@/domain/entities/Account'

export class RideGatewayHttp implements RideGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async signUp(input: Account): Promise<SignUpOutput> {
    const response = await this.httpClient.post('http://localhost:3333/signup', input)

    return response
  }

  async requestRide(input: any): Promise<any> {
    const response = await this.httpClient.post('http://localhost:3333/request_ride', input)

    return response
  }

  async getRide(rideId: string): Promise<any> {
    const response = await this.httpClient.get(`http://localhost:3333/rides/${rideId}`)

    return response
  }
}
