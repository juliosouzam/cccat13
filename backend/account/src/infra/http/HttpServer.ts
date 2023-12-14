export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head';

export interface HttpServer {
  on(method: HttpMethod, path: string, callback: Function): void;
  listen(port?: number): Promise<void>;
}
