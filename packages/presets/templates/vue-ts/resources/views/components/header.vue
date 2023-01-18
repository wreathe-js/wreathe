<script setup lang="ts">
import { Link as RouterLink } from '@wreathe-js/vue'
</script>

<template>
  <header>
    <nav class="container">
      <h2>
        <RouterLink href="/">Preact App</RouterLink>
      </h2>
      <ul>
        <li>
          <RouterLink href="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink href="/example">Example</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
