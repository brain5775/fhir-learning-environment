/**
 * Decode a Base64 string as UTF-8 text.
 *
 * HAPI stores CSV and JSON attachments as Base64. Using TextDecoder avoids
 * corrupting Traditional Chinese characters that can occur with atob alone.
 */
export function decodeBase64Utf8(value: string): string {
  const cleaned = value.replace(/\s/g, '')
  const binary = atob(cleaned)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new TextDecoder('utf-8').decode(bytes)
}

export function stripByteOrderMark(value: string): string {
  return value.replace(/^\uFEFF/, '')
}
