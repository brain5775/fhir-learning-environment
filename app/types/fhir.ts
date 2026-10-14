export interface FhirCoding {
  system?: string
  code?: string
  display?: string
}

export interface FhirCodeableConcept {
  coding?: FhirCoding[]
  text?: string
}

export interface FhirReference {
  reference: string
  display?: string
}

export interface FhirObservationComponent {
  code: FhirCodeableConcept
  valueCodeableConcept?: FhirCodeableConcept
  valueString?: string
  [key: string]: unknown
}

export interface HahObservationTemplate {
  resourceType?: string
  status?: string
  category?: FhirCodeableConcept[]
  code?: {
    coding?: FhirCoding[]
    [key: string]: unknown
  }
  subject?: FhirReference
  effectiveDateTime?: string
  component?: FhirObservationComponent[]
  [key: string]: unknown
}
