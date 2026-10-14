<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed border-brand-border bg-slate-50 p-6 text-center text-sm text-brand-muted">
    <p class="font-medium text-brand-text">
      {{ title }}
    </p>
    <p
      v-if="description"
      class="mt-1"
    >
      {{ description }}
    </p>
  </div>
</template>
