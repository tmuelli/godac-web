import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import React, { Fragment } from "react";
import type { EntrySummary } from "../types/types";

interface ISelectListProps {
  title: string;
  entries: EntrySummary[];
  activeIndex?: number;
  onSelect?: (entry: EntrySummary, index: number) => void;
}

export function SelectList(props: ISelectListProps) {
  const { title, entries, activeIndex, onSelect } = props;

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    onSelect?.(entries[index], index);
  };

  const currentIndex = activeIndex ?? selectedIndex;

  React.useEffect(() => {
    selectRef.current?.scrollIntoView({
      block: "nearest",
    });
  }, [currentIndex]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <List
        component="nav"
        aria-label="select list"
        subheader={
          <ListSubheader component="div" id="select-list-title">
            {title}
          </ListSubheader>
        }
      >
        {entries.map((entry, entryIndex) => {
          return (
            <Fragment key={entry.id}>
              <Divider />
              <ListItemButton
                ref={currentIndex === entryIndex ? selectRef : null}
                selected={currentIndex === entryIndex}
                onMouseDown={(event) => handleListItemClick(event, entryIndex)}
              >
                <ListItemText primary={`${entry.name}`} />
              </ListItemButton>
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}
