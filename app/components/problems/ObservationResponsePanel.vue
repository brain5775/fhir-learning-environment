<script setup lang="ts">
import type { FhirSubmitResponse } from '~/services/fhirObservation'

const { t } = useLocale()

defineProps<{
  result: FhirSubmitResponse | null
  loading?: boolean
}>()
</script>

<template>
  <section
    class="rounded-xl border border-brand-border bg-brand-card p-4 shadow-sm"
    aria-labelledby="response-panel-title"
  >
    <h2
      id="response-panel-title"
      class="text-base font-bold text-brand-navy"
    >
      {{ t('observation.response.title') }}
    </h2>

    <div
      v-if="loading"
      class="mt-3"
    >
      <LoadingState :label="t('observation.response.loading')" />
    </div>

    <div
      v-else-if="result"
      class="mt-3 space-y-3"
    >
      <div class="flex flex-wrap items-center gap-2">
        <StatusBadge
          :label="result.ok ? t('observation.response.success') : t('observation.response.failed')"
          :color="result.ok ? 'success' : 'danger'"
        />
        <span class="font-mono text-sm text-brand-text">
          HTTP {{ result.status }} {{ result.statusText }}
        </span>
        <span
          v-if="result.resourceId"
          class="font-mono text-xs text-brand-muted"
        >
          Resource ID: {{ result.resourceId }}
        </span>
      </div>

      <p
        v-if="result.error"
        class="rounded-md bg-red-50 p-3 text-sm text-red-700"
      >
        {{ result.error }}
      </p>

      <div
        v-if="result.resourceUrl"
        class="rounded-md bg-green-50 p-3 text-sm text-green-800"
      >
        <p class="font-semibold">
          {{ t('observation.response.createdObservation') }}
        </p>
        <a
          :href="result.resourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-1 block break-all font-mono text-xs underline focus-visible:outline-2 focus-visible:outline-green-700"
        >
          {{ result.resourceUrl }}
        </a>
      </div>

      <textarea
        readonly
        :value="result.bodyText"
        class="min-h-[180px] w-full rounded-lg border border-brand-border bg-slate-50 p-3 font-mono text-xs leading-relaxed text-brand-text"
        aria-label="{{ t('observation.response.title') }}"
      />
    </div>

    <p
      v-else
      class="mt-3 text-sm text-brand-muted"
    >
      {{ t('observation.response.notSubmitted') }} {{ t('observation.response.notSubmittedHint') }}
    </p>
  </section>
</template>
