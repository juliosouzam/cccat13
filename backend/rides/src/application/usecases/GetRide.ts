import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountGateway } from '../gateway/AccountGateway';
import { RideRepository } from '../repositories/RideRepository';

export class GetRide {
  private rideRepository: RideRepository;

  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    private readonly accountGateway: AccountGateway
  ) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
  }

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId);
    const account = await this.accountGateway.getById(ride.passengerId);
    if (!account) throw new Error('Account not found');

    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      status: ride.getStatus(),
      distance: ride.getDistance(),
      fare: ride.getFare(),
      from: {
        lat: ride.from.getLat(),
        long: ride.from.getLong(),
      },
      to: { lat: ride.to.getLat(), long: ride.to.getLong() },
      date: ride.date.toISOString(),
      passenger: {
        accountId: account.id,
        name: account.name,
        email: account.email,
        cpf: account.cpf,
      },
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  driverId?: string;
  status: string;
  from: { lat: number; long: number };
  to: { lat: number; long: number };
  date: string;
  distance: number;
  fare: number;
  passenger: {
    accountId: string;
    name: string;
    email: string;
    cpf: string;
  };
};
