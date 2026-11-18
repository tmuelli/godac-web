import { Box, List } from "@mui/material";
import type { IInputListRow } from "../types/types";
import { Fragment } from "react/jsx-runtime";
import { InputListRow } from "./InputListRow";

interface IInputListProps {
  rows: IInputListRow[];
}

export function InputList(props: IInputListProps) {
  const { rows } = props;

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="input list">
        {rows.map((row) => (
          <Fragment key={row.id}>
            <InputListRow
              name={row.name}
              type={row.inputType}
              options={row.options}
            />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
