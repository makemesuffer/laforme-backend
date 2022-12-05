export enum StatisticType {
  MasterClass = 0,
  ElectronicPatternProduct = 1,
  PrintedPatternProduct = 2,
  SewingProduct = 3,
  All = 9,
  PrintProduct = 10,
  ElectronicProduct = 11,
  PatternProduct = 12,
}

export enum StatisticError {
  StatisticNotFound = 'StatisticNotFound',
  StatisticTypeNotFound = 'StatisticTypeNotFound',
}
