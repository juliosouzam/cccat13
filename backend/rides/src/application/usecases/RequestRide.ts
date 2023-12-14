import { RideRepository } from '../repositories/RideRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { Ride } from '../../domain/Ride';
import { RepositoryFactory } from '../factory/RepositoryFactory';

export class RequestRide {
  private rideRepository: RideRepository;
  private accountRepository: AccountRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
    this.accountRepository = this.repositoryFactory.createAccountRepository();
  }

  async execute(input: Input) {
    const account = await this.accountRepository.getById(input.passengerId);
    if (!account?.isPassenger)
      throw new Error('Account is not from a Passenger');
    const activeRides = await this.rideRepository.getActiveRidesByPassengerId(
      input.passengerId
    );
    if (activeRides.length)
      throw new Error('This passenger already has an active ride.');
    const ride = Ride.create(
      input.passengerId,
      input.from.lat,
      input.from.long,
      input.to.lat,
      input.to.long
    );
    await this.rideRepository.save(ride);

    return {
      rideId: ride.rideId,
    };
  }
}

type Input = {
  passengerId: string;
  from: {
    lat: number;
    long: number;
  };
  to: {
    lat: number;
    long: number;
  };
};
