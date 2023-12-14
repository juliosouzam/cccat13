export interface AccountGateway {
  getById(accountId: string): Promise<any>;
  signUp(input: any): Promise<any>;
}
