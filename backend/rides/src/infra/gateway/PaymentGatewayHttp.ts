import { PaymentGateway } from '../../application/gateway/PaymentGateway';
import { HttpClient } from '../http/HttpClient';

export class PaymentGatewayHttp implements PaymentGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async process(input: any): Promise<any> {
    return this.httpClient.post(
      `http://localhost:3335/process_payments`,
      input
    );
  }
}
