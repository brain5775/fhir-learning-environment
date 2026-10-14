import { submitObservation } from '~/services/fhirObservation'
import type { FhirSubmitResponse } from '~/services/fhirObservation'

export function useFhirClient() {
  const hah = useHahConfig()
  const loading = ref(false)
  const result = ref<FhirSubmitResponse | null>(null)
  const error = ref<string | null>(null)

  async function submit(jsonText: string): Promise<FhirSubmitResponse> {
    loading.value = true
    error.value = null
    result.value = null

    const response = await submitObservation(jsonText, hah.fhir.baseUrl)
    result.value = response

    if (!response.ok) {
      error.value = response.error
    }

    loading.value = false
    return response
  }

  function reset() {
    result.value = null
    error.value = null
  }

  return {
    loading,
    result,
    error,
    submit,
    reset
  }
}
