<script setup lang="ts">
import { inject, ref } from 'vue'
import type { RideGateway } from '../infra/gateway/RideGateway'

const ride = ref({
  status: '',
  passengerId: '',
  passenger: {
    name: '',
    email: '',
    cpf: ''
  }
})
const rideId = ref('')
const errorMessage = ref('')
const rideGateway = inject<RideGateway>('rideGateway') as RideGateway

async function submit() {
  try {
    const output = await rideGateway.getRide(rideId.value)
    ride.value = output
  } catch (error: any) {
    errorMessage.value = error.message
  }
}

</script>

<template>
  <main>
    <h2 class="get-ride-title">Get Ride</h2>
    <input type="text" class="get-ride-ride-id" v-model="rideId" />
    <button class="get-ride-submit" @click="submit()">Submit</button>
    <div v-if="ride.status">
      <span class="get-ride-status">{{ ride.status }}</span>
      <span class="get-ride-passenger-id">{{ ride.passengerId }}</span>
      <span class="get-ride-passenger-name">{{ ride.passenger.name }}</span>
      <span class="get-ride-passenger-email">{{ ride.passenger.email }}</span>
      <span class="get-ride-passenger-cpf">{{ ride.passenger.cpf }}</span>
    </div>
  </main>
</template>

<style scoped></style>
