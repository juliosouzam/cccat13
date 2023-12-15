import { GetAccount } from '../../application/usecases/GetAccount';
import { SignUp } from '../../application/usecases/SignUp';
import { HttpServer } from '../http/HttpServer';

export class MainController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly signUp: SignUp,
    private readonly getAccount: GetAccount
  ) {
    this.httpServer.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signUp.execute(body);
      return output;
    });

    this.httpServer.on(
      'get',
      '/accounts/:accountId',
      async (params: any, body: any) => {
        const output = await this.getAccount.execute(params.accountId);

        return output;
      }
    );
  }
}
