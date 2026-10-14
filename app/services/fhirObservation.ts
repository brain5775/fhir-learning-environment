export interface FhirSubmitResponse {
  ok: boolean
  status: number
  statusText: string
  bodyText: string
  bodyJson: unknown | null
  resourceId: string | null
  resourceUrl: string | null
  error: string | null
}

export async function submitObservation(
  jsonText: string,
  baseUrl: string
): Promise<FhirSubmitResponse> {
  let parsed: unknown

  try {
    parsed = JSON.parse(jsonText)
  } catch {
    return {
      ok: false,
      status: 0,
      statusText: 'Invalid JSON',
      bodyText: '',
      bodyJson: null,
      resourceId: null,
      resourceUrl: null,
      error: 'JSON 解析失敗，請確認編輯後的內容仍是有效 JSON'
    }
  }

  if (!isObject(parsed) || parsed.resourceType !== 'Observation') {
    return {
      ok: false,
      status: 0,
      statusText: 'Invalid Observation',
      bodyText: '',
      bodyJson: parsed,
      resourceId: null,
      resourceUrl: null,
      error: 'JSON 必須是 FHIR Observation 資源'
    }
  }

  const url = `${baseUrl.replace(/\/+$/, '')}/Observation`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      },
      body: JSON.stringify(parsed)
    })
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: 'Network error',
      bodyText: '',
      bodyJson: null,
      resourceId: null,
      resourceUrl: null,
      error: `網路請求失敗：${(error as Error).message || '請檢查網路連線、CORS 或 FHIR 伺服器狀態'}`
    }
  }

  const bodyText = await response.text()
  let bodyJson: unknown

  try {
    bodyJson = bodyText ? JSON.parse(bodyText) : null
  } catch {
    bodyJson = null
  }

  const resourceId
    = isObject(bodyJson) && typeof bodyJson.id === 'string' ? bodyJson.id : null

  const resourceUrl
    = response.ok && resourceId
      ? `${baseUrl.replace(/\/+$/, '')}/Observation/${resourceId}`
      : null

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    bodyText,
    bodyJson,
    resourceId,
    resourceUrl,
    error: response.ok ? null : buildHttpError(response.status, bodyJson, bodyText)
  }
}

function buildHttpError(status: number, bodyJson: unknown, bodyText: string): string {
  if (isObject(bodyJson) && bodyJson.resourceType === 'OperationOutcome') {
    const issues = Array.isArray(bodyJson.issue) ? bodyJson.issue : []
    const details = issues
      .map((issue) => {
        if (!isObject(issue)) return ''
        const severity = typeof issue.severity === 'string' ? issue.severity : ''
        const diagnostics = typeof issue.diagnostics === 'string' ? issue.diagnostics : ''
        return [severity, diagnostics].filter(Boolean).join('：')
      })
      .filter(Boolean)
      .join('；')

    if (details) {
      return `FHIR 伺服器回傳 ${status}：${details}`
    }
  }

  return `FHIR 伺服器回傳 ${status}：${bodyText.slice(0, 500) || responseStatusText(status)}`
}

function responseStatusText(status: number): string {
  return status >= 500 ? '伺服器錯誤' : '請求失敗'
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
