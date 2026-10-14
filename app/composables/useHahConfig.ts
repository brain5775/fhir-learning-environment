export function useHahConfig() {
  const runtimeConfig = useRuntimeConfig()
  const publicConfig = runtimeConfig.public as {
    hah?: {
      appName?: string
      patientId?: string
      fhir?: {
        baseUrl?: string
        observationTemplateUrl?: string
        detailCsvUrl?: string
        problemDetailCodeSystemBase?: string
      }
    }
  }
  const hahConfig = publicConfig.hah ?? {}
  const fhirConfig = hahConfig.fhir ?? {}

  return {
    appName: hahConfig.appName || 'HaH 醫院居家照護系統',
    patientId: hahConfig.patientId || '',
    fhir: {
      baseUrl: fhirConfig.baseUrl || 'https://hapi.fhir.org/baseR4',
      observationTemplateUrl: fhirConfig.observationTemplateUrl || '',
      detailCsvUrl: fhirConfig.detailCsvUrl || '',
      problemDetailCodeSystemBase:
        fhirConfig.problemDetailCodeSystemBase || 'https//misac/codesystem/patient_problem_detail_code'
    }
  }
}
