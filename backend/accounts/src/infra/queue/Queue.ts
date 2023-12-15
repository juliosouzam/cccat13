export interface Queue {
  publish(queue: string, payload: any): Promise<void>;
  consume(queue: string, callback: Function): Promise<void>;
}
