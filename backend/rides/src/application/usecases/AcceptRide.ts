import { RideRepository } from '../repositories/RideRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { RepositoryFactory } from '../factory/RepositoryFactory';

export class AcceptRide {
  private rideRepository: RideRepository;
  private accountRepository: AccountRepository;

  constructor(private readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
    this.accountRepository = this.repositoryFactory.createAccountRepository();
  }

  async execute(input: Input) {
    const account = await this.accountRepository.getById(input.driverId);
    if (!account?.isDriver) throw new Error('Account is not from a Driver.');
    const ride = await this.rideRepository.getById(input.rideId);
    ride.accept(input.driverId);
    const activeRides = await this.rideRepository.getActiveRidesByDriverId(
      input.driverId
    );
    if (activeRides.length)
      throw new Error('Driver in already in another ride.');

    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
  driverId: string;
};
