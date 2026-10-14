<script setup lang="ts">
const { t } = useLocale()
defineProps<{
  title?: string
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    <p class="font-semibold">
      {{ title || t('ui.errorTitle') }}
    </p>
    <p class="mt-1 whitespace-pre-wrap">
      {{ message }}
    </p>
    <button
      type="button"
      class="mt-3 rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-600"
      @click="emit('retry')"
    >
      {{ t('ui.reload') }}
    </button>
  </div>
</template>
