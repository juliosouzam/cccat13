import { Ride } from "../../domain/Ride";

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  update(ride: any): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
}
