import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountGateway } from '../gateway/AccountGateway';
import { RideRepository } from '../repositories/RideRepository';

export class AcceptRide {
  private rideRepository: RideRepository;

  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    private readonly accountGateway: AccountGateway
  ) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
  }

  async execute(input: Input) {
    const account = await this.accountGateway.getById(input.driverId);
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
