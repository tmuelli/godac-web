import type { components } from "./schema";

type Schemas = components["schemas"];

export type EntrySummary = Schemas["SpecieSummary"];
export type ApiErrorBody = Schemas["Error"];

export type InputRowType = "numeric" | "select";

// TODO: make fields optional depending on type or new extended interfaces
export interface IInputListRowOptions {
  value: string;
  options: EntrySummary[];

  min: number;
  max: number;
}

export interface IInputListRow {
  id: string;
  name: string;
  inputType: InputRowType;
  options: IInputListRowOptions;
}
