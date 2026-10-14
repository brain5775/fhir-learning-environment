<script setup lang="ts">
const { t } = useLocale()
const props = defineProps<{
  modelValue: string
  statusMessage?: string
  copyLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'copy': []
}>()

const copied = ref(false)

async function copy() {
  emit('copy')
  try {
    await navigator.clipboard.writeText(props.modelValue)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <section
    class="rounded-xl border border-brand-border bg-brand-card p-4 shadow-sm"
    aria-labelledby="observation-json-title"
  >
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2
          id="observation-json-title"
          class="text-base font-bold text-brand-navy"
        >
          {{ t('observation.editor.title') }}
        </h2>
        <p class="text-xs text-brand-muted">
          {{ t('observation.editor.editable') }}
        </p>
      </div>
      <button
        type="button"
        class="rounded-md bg-brand-navy px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="!modelValue"
        @click="copy"
      >
        {{ copied ? t('observation.editor.copied') : (copyLabel || t('observation.editor.copy')) }}
      </button>
    </div>

    <textarea
      :value="modelValue"
      class="min-h-[280px] w-full rounded-lg border border-brand-border bg-slate-50 p-3 font-mono text-xs leading-relaxed text-brand-text focus-visible:outline-2 focus-visible:outline-brand-navy"
      spellcheck="false"
      aria-label="FHIR Observation JSON"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <p
      v-if="statusMessage"
      class="mt-2 text-xs text-brand-teal"
    >
      {{ statusMessage }}
    </p>
  </section>
</template>
