import { expect, test } from 'vitest';
import { PaymentGatewayHttp } from '../../src/infra/gateway/PaymentGatewayHttp';
import { FetchAdapter } from '../../src/infra/http/FetchAdapter';

test.skip('Deve criar uma conta de passageiro', async () => {
  const httpClient = new FetchAdapter();
  const paymentGateway = new PaymentGatewayHttp(httpClient);
  // given
  const input = {
    rideId: '123456',
    fare: 10,
  };
  // when
  const output = await paymentGateway.process(input);
  // then
  // const outputGetAccount = responseGetAccount.data;
  expect(output.status).toBe('approved');
});
