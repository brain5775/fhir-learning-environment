<script setup lang="ts">
const { t } = useLocale()
definePageMeta({ title: '系統設定' })

const hah = useHahConfig()
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-xl border border-brand-border bg-brand-card p-5 shadow-sm">
      <h1 class="text-2xl font-bold text-brand-navy">
        {{ t('settings.pageTitle') }}
      </h1>
      <p class="mt-2 text-sm text-brand-muted">
        {{ t('settings.body') }}
      </p>
    </section>

    <section class="rounded-xl border border-brand-border bg-brand-card p-5 shadow-sm">
      <h2 class="text-lg font-bold text-brand-navy">
        {{ t('settings.fhirSettings') }}
      </h2>
      <dl class="mt-3 space-y-3 text-sm">
        <div>
          <dt class="font-semibold text-brand-text">
            Patient ID
          </dt>
          <dd class="mt-1 break-all font-mono text-brand-muted">
            {{ hah.patientId }}
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-brand-text">
            FHIR Base URL
          </dt>
          <dd class="mt-1 break-all font-mono text-brand-muted">
            {{ hah.fhir.baseUrl }}
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-brand-text">
            Observation Template URL
          </dt>
          <dd class="mt-1 break-all font-mono text-brand-muted">
            {{ hah.fhir.observationTemplateUrl }}
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-brand-text">
            Detail CSV URL
          </dt>
          <dd class="mt-1 break-all font-mono text-brand-muted">
            {{ hah.fhir.detailCsvUrl }}
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-brand-text">
            Problem Detail Code System Base
          </dt>
          <dd class="mt-1 break-all font-mono text-brand-muted">
            {{ hah.fhir.problemDetailCodeSystemBase }}
          </dd>
        </div>
      </dl>

      <div class="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        {{ t('settings.uriWarning') }}
      </div>
    </section>
  </div>
</template>
