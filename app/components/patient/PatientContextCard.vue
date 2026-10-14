<script setup lang="ts">
const { t } = useLocale()
defineProps<{
  patientId: string
  timestamp: string
  selectedProblemLabel: string
  dataLoading: boolean
  connectionState: 'unknown' | 'connected' | 'error'
  templateLoaded: boolean
}>()
</script>

<template>
  <section
    class="rounded-xl border border-brand-border bg-brand-card p-4 shadow-sm"
    aria-labelledby="patient-context-title"
  >
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2
        id="patient-context-title"
        class="text-base font-bold text-brand-navy"
      >
        {{ t('patient.contextTitle') }}
      </h2>
      <StatusBadge
        :label="connectionState === 'connected' ? t('patient.connected') : connectionState === 'error' ? t('patient.error') : t('patient.unknown')"
        :color="connectionState === 'connected' ? 'success' : connectionState === 'error' ? 'danger' : 'neutral'"
      />
    </div>

    <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          FHIR Patient ID
        </dt>
        <dd class="mt-1 break-all font-mono text-brand-text">
          {{ patientId || t('patient.notSet') }}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          {{ t('patient.recordingTime') }}
        </dt>
        <dd class="mt-1 font-mono text-brand-text">
          {{ timestamp || t('patient.notGenerated') }}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          {{ t('patient.selectedProblem') }}
        </dt>
        <dd class="mt-1 text-brand-text">
          {{ selectedProblemLabel || t('patient.notSelected') }}
        </dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          {{ t('patient.templateLoaded') }}
        </dt>
        <dd class="mt-1 text-brand-text">
          {{ templateLoaded ? t('patient.templateLoadedTrue') : t('patient.templateLoadedFalse') }}
        </dd>
      </div>
    </dl>

    <div
      v-if="dataLoading"
      class="mt-3"
    >
      <LoadingState :label="t('patient.loadingProblemDefinitions')" />
    </div>

    <p class="mt-3 text-xs text-brand-muted">
      {{ t('patient.doNotDisplayDemographics') }}
    </p>
  </section>
</template>
