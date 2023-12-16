import { Connection } from '../../infra/database/Connection';
import { Presenter } from '../presenter/Presenter';

export class GetRides {
  constructor(
    private readonly connection: Connection,
    private readonly presenter: Presenter
  ) {}

  async execute(input?: Input): Promise<Output[]> {
    const ridesData = await this.connection.query(
      `SELECT r.*, p.name as passenger_name, p.email as passenger_email, d.name as driver_name, d.email as driver_email FROM cccat13.rides r INNER JOIN cccat13.accounts p ON r.passenger_id = p.id LEFT JOIN cccat13.accounts d ON r.driver_id = d.id;`,
      []
    );

    const output = ridesData.map((rideData: any) => ({
      rideId: rideData.id,
      passengerName: rideData.passenger_name,
      driverEmail: rideData.driver_email,
    }));

    return this.presenter.present(output);
  }
}

type Input = {
  size?: number;
  date?: Date;
};

type Output = {
  rideId: string;
  passengerName: string;
  driverEmail: string;
};
