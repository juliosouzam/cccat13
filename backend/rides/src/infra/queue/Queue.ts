export interface Queue {
  publish(exchange: string, payload: any): Promise<void>;
  consume(exchange: string, queue: string, callback: Function): Promise<void>;
}
