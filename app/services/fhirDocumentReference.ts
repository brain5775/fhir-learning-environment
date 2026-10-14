import { decodeBase64Utf8 } from '~/utils/base64'
import type { HahObservationTemplate } from '~/types/fhir'

export interface DocumentReferenceAttachment {
  contentType?: string
  data?: string
  title?: string
  creation?: string
  url?: string
}

export interface DocumentReferenceLike {
  resourceType: string
  id?: string
  status?: string
  content?: Array<{
    attachment?: DocumentReferenceAttachment
    format?: unknown
  }>
  [key: string]: unknown
}

export async function fetchDocumentReference(
  url: string
): Promise<DocumentReferenceLike> {
  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/fhir+json'
      }
    })
  } catch (error) {
    throw new Error(
      `無法連線至 FHIR DocumentReference：${(error as Error).message || '網路或 CORS 錯誤'}`,
      { cause: error }
    )
  }

  if (!response.ok) {
    throw new Error(`FHIR DocumentReference 請求失敗：HTTP ${response.status} ${response.statusText}`)
  }

  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new Error('DocumentReference 回應不是有效的 JSON')
  }

  if (!isDocumentReference(json)) {
    throw new Error('回應不是有效的 FHIR DocumentReference')
  }

  const attachment = json.content?.[0]?.attachment
  if (!attachment?.data) {
    throw new Error('DocumentReference.content.attachment.data 缺少 Base64 資料')
  }

  return json
}

export function extractAttachment(dr: DocumentReferenceLike): DocumentReferenceAttachment {
  const attachment = dr.content?.[0]?.attachment
  if (!attachment?.data) {
    throw new Error('DocumentReference.content.attachment.data 缺少 Base64 資料')
  }
  return attachment
}

function isDocumentReference(value: unknown): value is DocumentReferenceLike {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return candidate.resourceType === 'DocumentReference' && Array.isArray(candidate.content)
}

export async function fetchObservationTemplate(
  url: string
): Promise<HahObservationTemplate> {
  const documentReference = await fetchDocumentReference(url)
  const attachment = extractAttachment(documentReference)

  let decoded: string
  try {
    decoded = decodeBase64Utf8(attachment.data as string)
  } catch {
    throw new Error('Base64 解碼失敗')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(decoded)
  } catch {
    throw new Error('解碼後的 Observation 模板不是有效的 JSON')
  }

  if (!isObservationTemplate(parsed)) {
    throw new Error('解碼後的内容不是有效的 FHIR Observation 模板')
  }

  return parsed as HahObservationTemplate
}

function isObservationTemplate(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return candidate.resourceType === 'Observation'
}
