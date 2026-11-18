import { Box } from "@mui/material";
import NumberField from "./NumberField";

interface INumericInputFieldProps {
  name: string;
  min: number;
  max: number;
}

export function NumericInputField(props: INumericInputFieldProps) {
  const { name, min, max } = props;
  return (
    <Box>
      <NumberField label={name} min={min} max={max} />
    </Box>
  );
}
