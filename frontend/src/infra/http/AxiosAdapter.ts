import axios from 'axios'
import type { HttpClient } from './HttpClient'

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    try {
      const response = await axios.get(url)

      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.error)
    }
  }

  async post(url: string, payload: any): Promise<any> {
    try {
      const response = await axios.post(url, payload)

      return response.data
    } catch (error: any) {
      throw new Error(error.response.data.error)
    }
  }
}
