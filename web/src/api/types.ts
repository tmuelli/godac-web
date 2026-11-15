import type { components } from './schema';

type Schemas = components["schemas"]

export type EntrySummary = Schemas["SpecieSummary"]
export type ApiErrorBody = Schemas["Error"]