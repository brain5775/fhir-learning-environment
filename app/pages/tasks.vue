<template>
  <div class="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
    <h1 class="text-2xl font-bold">
      {{ t('tasks.pageTitle') }}
    </h1>
    <p class="mt-2 text-sm">
      {{ t('tasks.body') }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale()
definePageMeta({ title: '任務與追蹤' })
</script>
