import type { ProblemDefinition, ProblemDetailOption, ProblemDetailGroup } from '~/types/problem'

export function normalizeProblemCode(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, '')
}

export function groupProblemDetails(options: ProblemDetailOption[]): ProblemDetailGroup[] {
  const groups: ProblemDetailGroup[] = []
  const groupIndex = new Map<string, number>()

  for (const option of options) {
    let index = groupIndex.get(option.detailCode)

    if (index === undefined) {
      index = groups.length
      groupIndex.set(option.detailCode, index)
      groups.push({
        detailCode: option.detailCode,
        label: option.detailName || option.detailCode,
        labelEn: option.detailNameEn,
        options: []
      })
    }

    const group = groups[index]
    if (group) group.options.push(option)
  }

  return groups
}

export function findProblemDefinition(
  configured: ProblemDefinition[],
  csvProblemCode: string
): ProblemDefinition | undefined {
  const normalized = normalizeProblemCode(csvProblemCode)
  return configured.find(definition => normalizeProblemCode(definition.csvProblemCode || definition.code) === normalized)
}

/**
 * The documented URI is intentionally constructed by concatenating the base
 * URI and the detail code. The base value lacks a colon after "https"; keep
 * this isolated and do not change its spelling here without clinical/document
 * owner confirmation.
 */
export function buildProblemDetailCodeSystem(base: string, detailCode: string): string {
  return `${base.trim()}${detailCode.trim()}`
}

export function selectionsToComponents(
  groups: ProblemDetailGroup[],
  selections: Record<string, string>,
  baseSystem: string
): Record<string, unknown>[] {
  const components: Record<string, unknown>[] = []

  for (const group of groups) {
    const selectedValue = selections[group.detailCode]
    if (!selectedValue) continue

    const option = group.options.find(item => item.valueCode === selectedValue)
    if (!option) continue

    const coding = [
      {
        system: option.system || undefined,
        code: option.code || option.valueCode,
        display: option.valueDisplay
      }
    ].filter(item => item.system || item.code || item.display)

    const component: Record<string, unknown> = {
      code: {
        coding: [
          {
            system: buildProblemDetailCodeSystem(baseSystem, group.detailCode),
            code: group.detailCode,
            display: group.label
          }
        ]
      }
    }

    if (option.valueType.toLowerCase() === 'string') {
      component.valueString = option.valueDisplay
    } else {
      component.valueCodeableConcept = {
        coding: coding.length > 0 ? coding : undefined
      }
    }

    components.push(component)
  }

  return components
}
