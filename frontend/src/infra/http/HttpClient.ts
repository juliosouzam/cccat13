export interface HttpClient {
  get(url: string): Promise<any>
  post(url: string, payload: any): Promise<any>
}
