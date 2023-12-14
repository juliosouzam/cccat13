import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountRepository } from '../repositories/AccountRepository';
import { RideRepository } from '../repositories/RideRepository';

export class GetRide {
  private rideRepository: RideRepository;
  private accountRepository: AccountRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
    this.accountRepository = this.repositoryFactory.createAccountRepository();
  }

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId);
    const account = await this.accountRepository.getById(ride.passengerId);
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
        accountId: account.accountId,
        name: account.name.getValue(),
        email: account.email.getValue(),
        cpf: account.cpf.getValue(),
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
