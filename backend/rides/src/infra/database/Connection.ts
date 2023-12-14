export interface Connection {
  query<T extends unknown[]>(
    statment: string,
    data: T
  ): Promise<any>;
  close(): Promise<void>;
}
