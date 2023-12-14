import type { Account } from '@/domain/entities/Account'

export type SignUpOutput = any

export interface RideGateway {
  signUp(input: Account): Promise<SignUpOutput>
  requestRide(input: any): Promise<any>
  getRide(rideId: string): Promise<any>
}
