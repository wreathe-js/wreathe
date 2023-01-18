<script setup lang="ts">
import { Head as WreatheHead } from '@wreathe-js/vue'
import Counter from '@/views/components/counter.vue'
</script>

<script lang="ts">
import DefaultLayout from '@/views/layouts/default.vue'

export default {
  layout: DefaultLayout,
}
</script>

<template>
  <div>
    <WreatheHead title="Example" />

    <h1>Counter</h1>
    <p>This is a simple, hydrated <code>Counter</code> component.</p>
    <Counter />
  </div>
</template>
