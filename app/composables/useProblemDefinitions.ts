import { decodeBase64Utf8, stripByteOrderMark } from '~/utils/base64'
import { parseCsv, csvRowsToObjects } from '~/utils/csvParser'
import {
  groupProblemDetails,
  normalizeProblemCode
} from '~/utils/observationMapper'
import {
  extractAttachment,
  fetchDocumentReference,
  fetchObservationTemplate
} from '~/services/fhirDocumentReference'
import type { HahObservationTemplate } from '~/types/fhir'
import type { ProblemDetailOption, ProblemDetailGroup } from '~/types/problem'

export function useProblemDefinitions() {
  const hah = useHahConfig()
  const configuredProblems = useProblemCatalog()

  const selectedProblemCode = ref(configuredProblems[0]?.code ?? '')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const connectionState = ref<'unknown' | 'connected' | 'error'>('unknown')

  const template = ref<HahObservationTemplate | null>(null)
  const detailRows = ref<ProblemDetailOption[]>([])

  const problemOptions = computed(() =>
    configuredProblems.map(definition => ({
      label: `${definition.display} (${definition.code})`,
      value: definition.code
    }))
  )

  const selectedProblem = computed(
    () => configuredProblems.find(item => item.code === selectedProblemCode.value)
  )

  const filteredDetailRows = computed(() => {
    const selected = selectedProblem.value
    if (!selected) return []
    return detailRows.value.filter((row) => {
      const definitionProblemCode = selected.csvProblemCode || selected.code
      return normalizeProblemCode(row.problemCode) === normalizeProblemCode(definitionProblemCode)
    })
  })

  const detailGroups = computed<ProblemDetailGroup[]>(() => groupProblemDetails(filteredDetailRows.value))

  const templateReady = computed(() => template.value !== null)

  async function load() {
    loading.value = true
    error.value = null

    try {
      const loadedTemplate = await fetchObservationTemplate(hah.fhir.observationTemplateUrl)
      template.value = loadedTemplate

      const documentReference = await fetchDocumentReference(hah.fhir.detailCsvUrl)
      const attachment = extractAttachment(documentReference)
      if (!attachment.data) {
        throw new Error('CSV DocumentReference.content.attachment.data 缺少 Base64 資料')
      }

      const decoded = stripByteOrderMark(decodeBase64Utf8(attachment.data))
      const rows = parseCsv(decoded)
      const objects = csvRowsToObjects(rows)

      const requiredHeaders = ['problemCode', 'detailCode', 'valueCode', 'valueDisplay']
      const headers = rows[0]?.map(header => header.trim()) ?? []
      for (const required of requiredHeaders) {
        if (!headers.includes(required)) {
          throw new Error(`CSV 缺少必要欄位：${required}`)
        }
      }

      const parsed: ProblemDetailOption[] = objects.map((row) => {
        const option: ProblemDetailOption = {
          problemCode: row.problemCode ?? '',
          detailCode: row.detailCode ?? '',
          detailName: row.detailName || row.detailCode || '',
          detailNameEn: row.detailNameEn || undefined,
          valueType: row.valueType || 'code',
          valueCode: row.valueCode ?? '',
          valueDisplay: row.valueDisplay ?? '',
          valueDisplayEn: row.valueDisplayEn || undefined,
          system: row.system || '',
          code: row.code || undefined
        }

        if (!option.detailCode || !option.valueCode || !option.valueDisplay) {
          throw new Error('CSV 包含空白 detailCode、valueCode 或 valueDisplay')
        }

        return option
      })

      detailRows.value = parsed
      connectionState.value = 'connected'
    } catch (caught) {
      template.value = null
      detailRows.value = []
      connectionState.value = 'error'
      error.value = caught instanceof Error ? caught.message : 'FHIR 資料載入失敗'
    } finally {
      loading.value = false
    }
  }

  function retry() {
    load()
  }

  return {
    hah,
    configuredProblems,
    selectedProblemCode,
    selectedProblem,
    problemOptions,
    loading,
    error,
    connectionState,
    template,
    templateReady,
    detailRows,
    detailGroups,
    load,
    retry
  }
}
