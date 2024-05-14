<template>
  <q-card class="fullscreen flex flex-center bg-blue-grey-7">
    <q-card :class="$q.screen.xs?'width-xs':'width'" class="text-center bg-blue-grey-7">
      <img src="https://img.freepik.com/premium-vector/no-data-empty-data-concept-illustration-vector_610956-1400.jpg" alt="not_found" class="shadow-10" style="border-radius: 50px">
      <q-btn to="/" push glossy rounded color="primary" icon="home" class="q-mt-xl">To home page</q-btn>
    </q-card>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ErrorNotFound'
});
</script>

<style scoped>
.width {
  width: 50%;
}
.width-xs {
  width: 95%;
}
</style>
