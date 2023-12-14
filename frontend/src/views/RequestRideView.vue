<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import type { RideGateway } from '../infra/gateway/RideGateway'
import type { GeolocationGateway } from '../infra/gateway/GeolocationGateway'

const ride = ref({
  from: {
    lat: -27.584905257808835,
    long: -48.545022195325124
  },
  to: {
    lat: -27.496887588317275,
    long: -48.522234807851476
  },
  passengerId: ''
})

const rideId = ref('')
const errorMessage = ref('')
const rideGateway = inject<RideGateway>('rideGateway') as RideGateway
const geolocationGateway = inject<GeolocationGateway>('geolocationGateway') as GeolocationGateway

async function submit() {
  try {
    const output = await rideGateway.requestRide(ride.value)
    rideId.value = output.rideId
  } catch (error: any) {
    errorMessage.value = error.message
  }
}

onMounted(async () => {
  const coords = await geolocationGateway.getGeolocation()

  ride.value.from.lat = coords.lat
  ride.value.from.long = coords.long
})
</script>

<template>
  <main>
    <h2 class="request-ride-title">Request Ride</h2>
    <input type="text" class="request-ride-passenger-id" v-model="ride.passengerId" />
    <input type="text" class="request-ride-from-lat" v-model="ride.from.lat" />
    <input type="text" class="request-ride-from-long" v-model="ride.from.long" />
    <input type="text" class="request-ride-to-lat" v-model="ride.to.lat" />
    <input type="text" class="request-ride-to-long" v-model="ride.to.long" />
    <button class="request-ride-submit" @click="submit()">Submit</button>
    <span v-if="rideId" class="request-ride-ride-id">{{ rideId }}</span>
    <span v-if="errorMessage" class="request-ride-error">{{ errorMessage }}</span>
  </main>
</template>

<style scoped></style>
