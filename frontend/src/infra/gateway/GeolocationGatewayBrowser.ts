import type { GeolocationGateway } from './GeolocationGateway'

export class GeolocationGatewayBrowser implements GeolocationGateway {
  async getGeolocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve({ lat: position.coords.latitude, long: position.coords.longitude })
      }, reject)
    })
  }
}
