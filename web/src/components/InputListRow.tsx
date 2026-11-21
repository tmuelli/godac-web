import type { IInputListRowOptions, InputRowType } from "../types/types";
import { Box, TextField } from "@mui/material";
import { NumericInputField } from "./NumericInputField";
import { SelectInputField } from "./SelectInputField";

interface IInputListRowProps {
  name: string;
  type: InputRowType;
  options: IInputListRowOptions;
}

export function InputListRow(props: IInputListRowProps) {
  const { name, type, options: opts } = props;

  // fallback to default text field if unknown type
  let inputField: React.JSX.Element = (
    <TextField id={`default-input-${name}`} label={name} variant="outlined" />
  );

  switch (type) {
    case "numeric":
      inputField = (
        <NumericInputField name={name} min={opts.min} max={opts.max} />
      );
      break;

    case "select":
      inputField = (
        <SelectInputField
          value={opts.value}
          name={name}
          options={opts.options}
        />
      );
      break;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box>{name}</Box>
      {inputField}
    </Box>
  );
}
