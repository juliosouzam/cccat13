import type { HttpClient } from './HttpClient'

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url)

    return response.json()
  }

  async post(url: string, payload: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const output = await response.json()
    if (!response.ok) {
      throw new Error(output.error)
    }

    return output
  }
}
