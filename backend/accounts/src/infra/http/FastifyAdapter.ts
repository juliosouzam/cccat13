import cors from '@fastify/cors';
import Fastify, { FastifyInstance } from 'fastify';

import { HttpMethod, HttpServer } from './HttpServer';

export class FastifyAdapter implements HttpServer {
  private readonly fastify: FastifyInstance;

  constructor(config?: {
    environment: 'development' | 'staging' | 'production';
  }) {
    this.fastify = Fastify({
      logger: config && config.environment === 'development',
    });
  }

  on(method: HttpMethod, path: string, callback: Function): void {
    this.fastify[method](path, async (request, reply) => {
      try {
        const output = await callback(request.params, request.body);

        return reply.send(output);
      } catch (error: unknown) {
        const err = error as Error;
        return reply.status(422).send({
          error: err.message,
        });
      }
    });
  }

  private async registerMiddlewares() {
    await this.fastify.register(cors);
  }

  async listen(port?: number | undefined): Promise<void> {
    try {
      await this.registerMiddlewares();
      await this.fastify.listen({ port });
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}
