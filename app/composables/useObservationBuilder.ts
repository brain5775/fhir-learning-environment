import { toRaw } from 'vue'
import { selectionsToComponents } from '~/utils/observationMapper'
import type { HahObservationTemplate } from '~/types/fhir'
import type { ProblemDefinition, ProblemDetailGroup } from '~/types/problem'

export function useObservationBuilder() {
  const patientId = ref('')
  const selectedProblem = ref<ProblemDefinition | null>(null)
  const template = ref<HahObservationTemplate | null>(null)
  const codeSystemBase = ref('')
  const selections = ref<Record<string, string>>({})

  const timestamp = ref('')
  const generatedResource = ref<Record<string, unknown> | null>(null)
  const jsonText = ref('')
  const validationErrors = ref<string[]>([])
  const lastSuccessMessage = ref('')

  function configure(input: {
    patientId: string
    problem: ProblemDefinition | null
    template: HahObservationTemplate | null
    codeSystemBase: string
    selections: Record<string, string>
  }) {
    patientId.value = input.patientId
    selectedProblem.value = input.problem
    template.value = input.template
    codeSystemBase.value = input.codeSystemBase
    selections.value = { ...input.selections }
  }

  function validate(): string[] {
    const errors: string[] = []

    if (!patientId.value.trim()) {
      errors.push('缺少 Patient ID 設定')
    }
    if (!selectedProblem.value) {
      errors.push('請選擇病人問題')
    }
    if (!template.value) {
      errors.push('Observation 模板尚未載入')
    } else {
      if (!template.value.code?.coding?.length) {
        errors.push('Observation 模板缺少 code.coding 結構')
      }
      if (!template.value.subject) {
        errors.push('Observation 模板缺少 subject 結構')
      }
      if (!Object.prototype.hasOwnProperty.call(template.value, 'effectiveDateTime')) {
        errors.push('Observation 模板缺少 effectiveDateTime 結構')
      }
    }

    return errors
  }

  function generate(groups: ProblemDetailGroup[]): boolean {
    validationErrors.value = validate()
    if (validationErrors.value.length > 0) {
      lastSuccessMessage.value = ''
      return false
    }

    const source = template.value as HahObservationTemplate
    const clone = structuredClone(toRaw(source)) as HahObservationTemplate
    const isoTime = new Date().toISOString()

    if (clone.code?.coding?.length) {
      clone.code.coding = clone.code.coding.map(coding => ({
        ...coding,
        code: selectedProblem.value!.code,
        display: selectedProblem.value!.display
      }))
    }

    clone.resourceType = clone.resourceType || 'Observation'
    clone.status = clone.status || 'final'
    clone.subject = {
      ...clone.subject,
      reference: `Patient/${patientId.value.trim()}`
    }
    clone.effectiveDateTime = isoTime

    clone.component = selectionsToComponents(groups, selections.value, codeSystemBase.value) as typeof clone.component

    generatedResource.value = clone as Record<string, unknown>
    jsonText.value = JSON.stringify(clone, null, 2)
    timestamp.value = isoTime
    validationErrors.value = []
    lastSuccessMessage.value = `已產生 FHIR Observation JSON（記錄時間：${isoTime}）`
    return true
  }

  function updateJsonText(value: string) {
    jsonText.value = value
  }

  return {
    patientId,
    selectedProblem,
    template,
    codeSystemBase,
    selections,
    timestamp,
    generatedResource,
    jsonText,
    validationErrors,
    lastSuccessMessage,
    configure,
    validate,
    generate,
    updateJsonText
  }
}
