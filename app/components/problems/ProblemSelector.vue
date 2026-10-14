<script setup lang="ts">
import type { ProblemDefinition } from '~/types/problem'

const { t } = useLocale()

const props = defineProps<{
  modelValue: string
  options: ProblemDefinition[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <section
    class="rounded-xl border border-brand-border bg-brand-card p-4 shadow-sm"
    aria-labelledby="problem-selector-title"
  >
    <div class="mb-2 flex items-center justify-between gap-3">
      <h2
        id="problem-selector-title"
        class="text-base font-bold text-brand-navy"
      >
        {{ t('problem.selector.title') }}
      </h2>
      <span class="text-xs text-brand-muted">Problem Selection</span>
    </div>

    <label
      for="problem-select"
      class="text-sm font-medium text-brand-text"
    >
      {{ t('problem.selector.problemType') }}
    </label>
    <select
      id="problem-select"
      class="mt-2 block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text shadow-sm focus-visible:outline-2 focus-visible:outline-brand-navy disabled:cursor-not-allowed disabled:bg-slate-100"
      :value="props.modelValue"
      :disabled="props.disabled"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="option in props.options"
        :key="option.code"
        :value="option.code"
      >
        {{ option.display }}（{{ option.code }}）
      </option>
    </select>

    <p
      v-if="props.options.length === 0"
      class="mt-2 text-xs text-brand-muted"
    >
      {{ t('problem.selector.none') }}
    </p>
  </section>
</template>
