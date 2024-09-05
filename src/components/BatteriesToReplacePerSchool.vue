<script setup lang="ts">
import type { BatteryPerAcademy } from '@/types/types'
import Card from './Card.vue'

defineProps<{
  batteriesToReplace?: BatteryPerAcademy
  schools?: string[]
}>()
</script>

<template>
  <Card v-if="!schools?.length || !batteriesToReplace">
    <p class="text-center">No batteries to replace</p>
  </Card>

  <Card v-else>
    <section v-for="school in schools" :key="school" class="my-4">
      <h3 class="title">School: {{ school }}</h3>
      <p class="text-sm font-bold">Batteries to replace:</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="battery in batteriesToReplace[school]" :key="battery.serialNumber">
          {{ battery.serialNumber }}
        </span>
      </div>
    </section>
  </Card>
</template>

<style scoped>
.title {
  @apply text-lg font-bold text-blue-700;
}
</style>
