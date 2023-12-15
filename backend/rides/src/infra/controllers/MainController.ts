import { GetRide } from '../../application/usecases/GetRide';
import { RequestRide } from '../../application/usecases/RequestRide';
import { HttpServer } from '../http/HttpServer';
import { Queue } from '../queue/Queue';

export class MainController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly requestRide: RequestRide,
    private readonly getRide: GetRide,
    private readonly queue: Queue
  ) {
    this.httpServer.on(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide.execute(body);

        return output;
      }
    );

    // command handler
    this.httpServer.on(
      'post',
      '/request_ride_async',
      async (params: any, body: any) => {
        await this.queue.publish('request.ride', body);
      }
    );

    this.httpServer.on(
      'get',
      '/rides/:rideId',
      async (params: any, body: any) => {
        const output = await this.getRide.execute(params.rideId);

        return output;
      }
    );
  }
}
