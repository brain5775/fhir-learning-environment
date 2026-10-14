<script setup lang="ts">
import type { ProblemDetailGroup } from '~/types/problem'

const { t } = useLocale()

const props = defineProps<{
  groups: ProblemDetailGroup[]
  modelValue: Record<string, string>
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

function selectedValue(detailCode: string): string {
  return props.modelValue[detailCode] || ''
}

function select(detailCode: string, valueCode: string) {
  emit('update:modelValue', {
    ...props.modelValue,
    [detailCode]: valueCode
  })
}
</script>

<template>
  <section
    class="space-y-4 rounded-xl border border-brand-border bg-brand-card p-4 shadow-sm"
    aria-labelledby="problem-details-title"
  >
    <div class="flex items-center justify-between gap-3">
      <h2
        id="problem-details-title"
        class="text-base font-bold text-brand-navy"
      >
        {{ t('problem.details.title') }}
      </h2>
      <span class="text-xs text-brand-muted">Problem Details from CSV</span>
    </div>

    <div
      v-if="groups.length === 0"
      class="rounded-lg border border-dashed border-brand-border bg-slate-50 p-4 text-sm text-brand-muted"
    >
      {{ t('problem.details.empty') }}
    </div>

    <fieldset
      v-for="group in groups"
      :key="group.detailCode"
      class="rounded-lg border border-brand-border p-3"
    >
      <legend class="px-1 text-sm font-semibold text-brand-text">
        {{ group.label }}
        <span
          v-if="group.labelEn"
          class="ms-1 text-xs font-normal text-brand-muted"
        >({{ group.labelEn }})</span>
      </legend>

      <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label
          v-for="option in group.options"
          :key="`${group.detailCode}-${option.valueCode}`"
          class="flex cursor-pointer items-start gap-2 rounded-md border border-transparent p-2 transition-colors hover:bg-brand-navy/5"
          :class="{ 'border-brand-teal bg-brand-teal/5': selectedValue(group.detailCode) === option.valueCode }"
        >
          <input
            type="radio"
            :name="`detail-${group.detailCode}`"
            :value="option.valueCode"
            :checked="selectedValue(group.detailCode) === option.valueCode"
            :disabled="disabled"
            class="mt-1 h-4 w-4 border-brand-border text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-navy"
            @change="select(group.detailCode, option.valueCode)"
          >
          <span class="text-sm">
            <span class="font-medium text-brand-text">{{ option.valueDisplay }}</span>
            <span
              v-if="option.valueDisplayEn"
              class="ms-1 text-xs text-brand-muted"
            >({{ option.valueDisplayEn }})</span>
            <span class="block font-mono text-[11px] text-brand-muted">
              valueCode: {{ option.valueCode }}
            </span>
          </span>
        </label>
      </div>
    </fieldset>
  </section>
</template>
