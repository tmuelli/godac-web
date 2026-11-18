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
}

export function SelectList(props: ISelectListProps) {
  const { title, entries } = props;

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List
        component="nav"
        aria-label="main mailbox folders"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        }
      >
        {entries.map((entry, entryIndex) => {
          return (
            <Fragment key={entry.id}>
              <Divider />
              <ListItemButton
                selected={selectedIndex === entryIndex}
                onClick={(event) => handleListItemClick(event, entryIndex)}
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
