import type { ProblemDefinition } from '~/types/problem'

/**
 * Clinical problem definitions are deployment configuration. The supplied
 * specification gives one example; keep additional problems here rather than
 * hard-coding symptom questions.
 */
export function useProblemCatalog(): ProblemDefinition[] {
  return [
    {
      code: 'chest-discomfort',
      display: '胸部不適',
      csvProblemCode: 'chest_discomfort'
    }
  ]
}
