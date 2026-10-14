<script setup lang="ts">
defineProps<{
  label: string
  color?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}>()
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    :class="{
      'bg-slate-100 text-slate-700': color === 'neutral' || !color,
      'bg-green-100 text-green-700': color === 'success',
      'bg-amber-100 text-amber-700': color === 'warning',
      'bg-red-100 text-red-700': color === 'danger',
      'bg-blue-100 text-blue-700': color === 'info'
    }"
  >
    {{ label }}
  </span>
</template>
