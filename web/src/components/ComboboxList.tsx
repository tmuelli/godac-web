import { Box } from "@mui/material";
import { SelectList } from "./SelectList";
import type { EntrySummary } from "../types/types";

interface IComboboxListProps {
  comboboxValues: EntrySummary[];
  activeIndex: number;
  onValueSelect: (entry: EntrySummary, selectedIndex: number) => void;
}

export function ComboboxList(props: IComboboxListProps) {
  const { comboboxValues, activeIndex, onValueSelect } = props;

  return (
    <Box
      sx={{
        maxHeight: 400,
        overflowY: "auto",
        zIndex: 10,
        position: "absolute",
      }}
    >
      <SelectList
        title=""
        entries={comboboxValues}
        activeIndex={activeIndex}
        onSelect={(entry: EntrySummary, selectedIndex: number) => {
          onValueSelect(entry, selectedIndex);
        }}
      />
    </Box>
  );
}
