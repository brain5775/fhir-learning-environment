<script setup lang="ts">
const { t } = useLocale()
defineProps<{
  label?: string
}>()
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-card p-4 text-sm text-brand-muted"
    role="status"
  >
    <span
      class="h-4 w-4 animate-spin rounded-full border-2 border-brand-border border-t-brand-navy"
      aria-hidden="true"
    />
    <span>{{ label || t('ui.loading') }}</span>
  </div>
</template>
