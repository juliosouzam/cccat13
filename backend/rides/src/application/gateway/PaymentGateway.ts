export interface PaymentGateway {
  process(input: any): Promise<any>;
}
