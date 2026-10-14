<script setup lang="ts">
const { t } = useLocale()
definePageMeta({
  title: '問題狀況紀錄'
})

const state = useProblemDefinitions()
const selectedProblemCode = state.selectedProblemCode
const stateSelectedProblem = state.selectedProblem
const selectedProblem = computed(() => stateSelectedProblem.value ?? null)
const problemOptions = state.configuredProblems
const loading = state.loading
const loadingError = state.error
const connectionState = state.connectionState
const template = state.template
const templateReady = state.templateReady
const detailGroups = state.detailGroups
const load = state.load
const retry = state.retry
const hah = state.hah

const builder = useObservationBuilder()
const selections = builder.selections

const fhirClient = useFhirClient()

watch([selectedProblem, template], () => {
  builder.patientId.value = hah.patientId
  builder.selectedProblem.value = selectedProblem.value
  builder.template.value = template.value
  builder.codeSystemBase.value = hah.fhir.problemDetailCodeSystemBase
}, { immediate: true })

const selectedProblemLabel = computed(() =>
  selectedProblem.value ? `${selectedProblem.value.display}（${selectedProblem.value.code}）` : ''
)

const timestampLabel = computed(() =>
  builder.timestamp.value || t('status.notGenerated')
)

const editorStatusMessage = computed(() => {
  if (builder.validationErrors.value.length > 0) {
    return builder.validationErrors.value.join('；')
  }
  return builder.lastSuccessMessage.value
})

onMounted(() => {
  load()
})

function generateJson() {
  const success = builder.generate(detailGroups.value)
  if (!success) return
}

function submitJson() {
  fhirClient.submit(builder.jsonText.value)
}
</script>

<template>
  <div class="space-y-6">
    <div
      class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
      role="note"
    >
      <p class="font-semibold">
        {{ t('problems.record.codeSystemNoticeTitle') }}
      </p>
      <p class="mt-1">
        {{ t('problems.record.codeSystemNoticeBody', { uri: hah.fhir.problemDetailCodeSystemBase }) }}
      </p>
    </div>

    <LoadingState
      v-if="loading"
      :label="t('problems.record.loading')"
    />

    <ErrorState
      v-else-if="loadingError"
      :title="t('problems.record.loadFailedTitle')"
      :message="loadingError"
      @retry="retry"
    />

    <div
      v-else
      class="space-y-6"
    >
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div class="space-y-6">
          <PatientContextCard
            :patient-id="hah.patientId"
            :timestamp="timestampLabel"
            :selected-problem-label="selectedProblemLabel"
            :data-loading="loading"
            :connection-state="connectionState"
            :template-loaded="templateReady"
          />

          <ProblemSelector
            v-model="selectedProblemCode"
            :options="problemOptions"
            :disabled="problemOptions.length === 0"
          />

          <ProblemDetailGroups
            v-model="selections"
            :groups="detailGroups"
          />
        </div>

        <div class="space-y-6">
          <section
            class="rounded-xl border border-brand-border bg-brand-card p-4 shadow-sm"
            aria-labelledby="generation-title"
          >
            <h2
              id="generation-title"
              class="text-base font-bold text-brand-navy"
            >
              {{ t('problems.record.generateTitle') }}
            </h2>
            <p class="mt-1 text-sm text-brand-muted">
              {{ t('problems.record.generateHint') }}
            </p>

            <div class="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                class="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy/90 focus-visible:outline-2 focus-visible:outline-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!templateReady"
                @click="generateJson"
              >
                {{ t('problems.record.generateButton') }}
              </button>

              <button
                type="button"
                class="rounded-lg border border-brand-teal bg-white px-4 py-2 text-sm font-semibold text-brand-teal shadow-sm hover:bg-brand-teal/5 focus-visible:outline-2 focus-visible:outline-brand-teal disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!builder.jsonText.value || fhirClient.loading.value"
                @click="submitJson"
              >
                {{ fhirClient.loading.value ? t('problems.record.submittingButton') : t('problems.record.submitButton') }}
              </button>
            </div>

            <p
              v-if="editorStatusMessage"
              class="mt-3 text-sm"
              :class="builder.validationErrors.value.length > 0 ? 'text-red-700' : 'text-green-700'"
            >
              {{ editorStatusMessage }}
            </p>

            <details class="mt-4 rounded-md border border-brand-border bg-slate-50 p-3 text-xs text-brand-muted">
              <summary class="cursor-pointer font-semibold text-brand-text">
                {{ t('problems.record.fhirEndpointAndSettings') }}
              </summary>
              <dl class="mt-2 space-y-1 font-mono">
                <div>
                  <dt class="inline font-semibold">
                    {{ t('problems.record.post') }}
                  </dt>
                  <dd class="inline">
                    {{ hah.fhir.baseUrl }}/Observation
                  </dd>
                </div>
                <div>
                  <dt class="inline font-semibold">
                    {{ t('problems.record.template') }}
                  </dt>
                  <dd class="inline break-all">
                    {{ hah.fhir.observationTemplateUrl }}
                  </dd>
                </div>
                <div>
                  <dt class="inline font-semibold">
                    {{ t('problems.record.csv') }}
                  </dt>
                  <dd class="inline break-all">
                    {{ hah.fhir.detailCsvUrl }}
                  </dd>
                </div>
              </dl>
            </details>
          </section>

          <ObservationJsonEditor
            v-model="builder.jsonText.value"
            :status-message="editorStatusMessage"
            @copy="() => {}"
          />

          <ObservationResponsePanel
            :result="fhirClient.result.value"
            :loading="fhirClient.loading.value"
          />
        </div>
      </div>
    </div>
  </div>
</template>
