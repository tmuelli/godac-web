import { Box, TextField } from "@mui/material";
import React from "react";
import type { EntrySummary } from "../types/types";
import { ComboboxList } from "./ComboboxList";

interface ISelectInputFieldProps {
  value: string;
  name: string;
  options: EntrySummary[];
  onSelectEntry?: (entry: EntrySummary) => void;
}

/**
 * SelectInputField
 * Field for text input and given valid values
 * With autocomplete (purposely implemented AutoComplete for learning purposes instead of using MUI's Autocomplete component)
 * @param props
 * @returns
 */
export function SelectInputField(props: ISelectInputFieldProps) {
  const { value, name, options, onSelectEntry } = props;

  const [isListVisible, setIsListVisible] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState<string | undefined>(
    undefined,
  );
  const [selectIndex, setSelectIndex] = React.useState(0);

  const reset = () => {
    setTypedValue(undefined);
    setIsListVisible(false);
    setSelectIndex(0);
  };

  const selectValue = (entry: EntrySummary) => {
    onSelectEntry?.(entry);
    reset();
  };

  const currentValue = typedValue ?? value;
  // TODO: use maybe includes instead of startsWith
  const filterValues = options.filter((o) =>
    o.name.toLowerCase().startsWith(currentValue.toLowerCase()),
  );

  const handleKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        if (isListVisible) {
          e.preventDefault();
          setSelectIndex((index) =>
            Math.min(index + 1, filterValues.length - 1),
          );
        }
        break;

      case "ArrowUp":
        if (isListVisible) {
          e.preventDefault();
          setSelectIndex((index) => Math.max(index - 1, 0));
        }
        break;

      case "Enter":
        e.preventDefault();

        if (isListVisible) {
          if (filterValues.length !== 0) {
            selectValue(filterValues[selectIndex]);
          }
        }
        break;

      case "Escape":
        e.preventDefault();
        reset();
        break;
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        position: "relative",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="select-input-field"
        value={currentValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTypedValue(event.target.value);
          setSelectIndex(0);
          setIsListVisible(true);
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          handleKeydown(event);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          if (typedValue !== undefined) {
            const searchEntry = filterValues.find(
              (v) => v.name.toLowerCase() === typedValue.toLowerCase(),
            );

            if (searchEntry !== undefined) {
              selectValue(searchEntry);
            } else {
              reset();
            }
          }

          setIsFocused(false);
        }}
        label={name}
        error={filterValues.length === 0}
      />
      {isListVisible && isFocused ? (
        <ComboboxList
          comboboxValues={filterValues}
          activeIndex={selectIndex}
          onValueSelect={(selectedEntry: EntrySummary) => {
            selectValue(selectedEntry);
          }}
        />
      ) : (
        ""
      )}
    </Box>
  );
}
