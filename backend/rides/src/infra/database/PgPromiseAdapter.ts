import pgp from 'pg-promise';

import { Connection } from './Connection';

export class PgPromiseAdapter implements Connection {
  private connection: pgp.IDatabase<{}>;

  constructor() {
    this.connection = pgp()('postgres://postgres:cccat13!@localhost:5432/app');
  }

  async query<T extends unknown[]>(statment: string, data: T): Promise<any> {
    return this.connection.query(statment, data);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
