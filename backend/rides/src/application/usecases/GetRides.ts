import { RepositoryFactory } from '../factory/RepositoryFactory';
import { AccountGateway } from '../gateway/AccountGateway';
import { RideRepository } from '../repositories/RideRepository';

export class GetRides {
  private rideRepository: RideRepository;

  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    private readonly accountGateway: AccountGateway
  ) {
    this.rideRepository = this.repositoryFactory.createRideRepository();
  }

  async execute(): Promise<Output[]> {
    const rides = await this.rideRepository.list();
    const output: Output[] = [];
    for (const ride of rides) {
      const passenger = await this.accountGateway.getById(ride.passengerId);
      if (!passenger) throw new Error('Passenger not found');
      let driver;
      if (ride.driverId) {
        driver = await this.accountGateway.getById(ride.driverId);
      }
      output.push({
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
          accountId: passenger.id,
          name: passenger.name,
          email: passenger.email,
          cpf: passenger.cpf,
        },
        driver: driver
          ? {
              accountId: driver.id,
              name: driver.name,
              email: driver.email,
              cpf: driver.cpf,
            }
          : undefined,
      });
    }
    return output;
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
  driver?: {
    accountId: string;
    name: string;
    email: string;
    cpf: string;
  };
};
