import { Box, MenuItem, TextField } from "@mui/material";

interface ISelectInputFieldProps {
  initial: string;
  name: string;
  options: string[];
}

export function SelectInputField(props: ISelectInputFieldProps) {
  const { initial, name, options } = props;

  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="select-input-field"
        select
        label={name}
        defaultValue={initial}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
