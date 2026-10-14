export interface CsvRow {
  [header: string]: string
}

/**
 * Parse a CSV document according to the common quoted-field rules.
 * Quoted fields may contain commas and escaped double quotes ("").
 */
export function parseCsv(text: string): string[][] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let fieldStarted = false

  const finishField = () => {
    row.push(field)
    field = ''
    fieldStarted = false
  }

  const finishRow = () => {
    if (row.length > 0 || fieldStarted) {
      finishField()
    }
    if (row.length > 0) {
      rows.push(row)
    }
    row = []
  }

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index]

    if (inQuotes) {
      if (char === '"') {
        if (normalized[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      fieldStarted = true
      continue
    }

    if (char === ',') {
      finishField()
      continue
    }

    if (char === '\n') {
      finishRow()
      continue
    }

    field += char
    fieldStarted = true
  }

  if (inQuotes) {
    throw new Error('CSV 解析失敗：引號未正確閉合')
  }

  if (fieldStarted || row.length > 0) {
    finishRow()
  }

  return rows
}

export function csvRowsToObjects(rows: string[][]): CsvRow[] {
  if (rows.length === 0) return []

  const firstRow = rows[0] ?? []
  const headers = firstRow.map(header => header.trim())
  const objects: CsvRow[] = []

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const values = rows[rowIndex] ?? []

    // Skip blank lines.
    if (values.length === 0 || values.every(value => value.trim() === '')) continue

    const row: CsvRow = {}
    headers.forEach((header, headerIndex) => {
      row[header] = (values[headerIndex] ?? '').trim()
    })
    objects.push(row)
  }

  return objects
}
