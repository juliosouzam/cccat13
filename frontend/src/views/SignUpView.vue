<script setup lang="ts">
import { inject, ref } from 'vue'

import type { RideGateway } from '../infra/gateway/RideGateway'
import { Account } from '@/domain/entities/Account'

const account = ref(new Account('', '', '', false, false, ''))
const accountId = ref('')
const errorMessage = ref('')
const rideGateway = inject<RideGateway>('rideGateway') as RideGateway

async function signUp() {
  const errors = account.value.validate()
  if (errors.length > 0) {
    errorMessage.value = errors.join(', ')
    return
  }
  try {
    const output = await rideGateway.signUp(account.value)
    accountId.value = output.accountId
  } catch (error: any) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <main>
    <h2 class="signup-title">Sign Up</h2>

    <input type="text" class="signup-name" v-model="account.name" />
    <input type="email" class="signup-email" v-model="account.email" />
    <input type="text" class="signup-cpf" v-model="account.cpf" />
    <input type="checkbox" class="signup-is-passenger" v-model="account.isPassenger" />
    <input type="checkbox" class="signup-is-driver" v-model="account.isDriver" />
    <input type="text" class="signup-car-plate" v-model="account.carPlate" />
    <button type="submit" class="signup-submit" @click="signUp()">Submit</button>
    <span v-if="accountId" class="signup-account-id">{{ accountId }}</span>
    <span v-if="errorMessage" class="signup-error">{{ errorMessage }}</span>
  </main>
</template>

<style scoped></style>
