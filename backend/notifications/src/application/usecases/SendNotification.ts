export class SendNotification {
  constructor() {}

  async execute(input: Input): Promise<void> {
    console.log('SendNotification: ', input);
  }
}

type Input = {
  type: string;
  payload: unknown;
};
