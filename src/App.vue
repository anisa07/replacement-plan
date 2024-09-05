<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BatteriesToReplacePerSchool from './components/BatteriesToReplacePerSchool.vue'
import { getAcademyWithBatteriesToReplace } from './battery-service/battery-service'
import type { BatteryPerAcademy } from './types/types'

const schools = ref<string[]>()
const batteriesToReplace = ref<BatteryPerAcademy>()

onMounted(async () => {
  const { grouppedBadBatteries, sortedAcademies } = await getAcademyWithBatteriesToReplace()
  schools.value = sortedAcademies
  batteriesToReplace.value = grouppedBadBatteries
})
</script>

<template>
  <main class="page">
    <section class="content gap-4">
      <h1 class="title">Device battery replacement required</h1>
      <BatteriesToReplacePerSchool :schools="schools" :batteriesToReplace="batteriesToReplace" />
    </section>
  </main>
</template>

<style scoped>
.page {
  @apply min-h-screen h-full bg-gradient-to-b from-blue-700 to-blue-600;
}
.content {
  @apply flex flex-col items-center mx-auto w-11/12 sm:w-9/12 md:w-7/12 h-full py-8 px-4;
}
.title {
  @apply text-xl font-bold text-white capitalize;
}
</style>
