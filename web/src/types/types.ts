import type { components } from "./schema";

type Schemas = components["schemas"];

export type EntrySummary = Schemas["SpecieSummary"];
export type ApiErrorBody = Schemas["Error"];

export type InputRowType = "numeric" | "select";

export interface IInputListRowOptions {
  initial?: string;
  options?: string[];

  min?: number;
  max?: number;
}

export interface IInputListRow {
  id: string;
  name: string;
  inputType: InputRowType;
  options: IInputListRowOptions;
}
