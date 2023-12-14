import { AccountGateway } from '../../application/gateway/AccountGateway';
import { HttpClient } from '../http/HttpClient';

export class AccountGatewayHttp implements AccountGateway {
  constructor(private readonly httpClient: HttpClient) {}

  async getById(accountId: string): Promise<any> {
    return this.httpClient.get(`http://localhost:3333/accounts/${accountId}`);
  }

  async signUp(input: any): Promise<any> {
    return this.httpClient.post(`http://localhost:3333/signup/`, input);
  }
}
