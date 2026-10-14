export interface ProblemDefinition {
  code: string
  display: string
  csvProblemCode?: string
}

export interface ProblemDetailOption {
  problemCode: string
  detailCode: string
  detailName: string
  detailNameEn?: string
  valueType: string
  valueCode: string
  valueDisplay: string
  valueDisplayEn?: string
  system: string
  code?: string
}

export interface ProblemDetailGroup {
  detailCode: string
  label: string
  labelEn?: string
  options: ProblemDetailOption[]
}
