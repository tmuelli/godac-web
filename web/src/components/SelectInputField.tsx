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
  const [isError, setIsError] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState<string | undefined>(
    undefined,
  );
  const [selectIndex, setSelectIndex] = React.useState(0);
  const [filterValues, setFilterValues] = React.useState<EntrySummary[]>([]);

  const updateFilter = (v: string) => {
    // TODO: use maybe includes instead of startsWith
    const newFilterValues = options.filter((o) =>
      o.name.toLowerCase().startsWith(v.toLowerCase()),
    );

    setFilterValues(() => [...newFilterValues]);
    setSelectIndex(0);

    setIsError(newFilterValues.length > 0 ? false : true);
  };

  const selectValue = (entry: EntrySummary) => {
    updateFilter(entry.name);
    onSelectEntry?.(entry);
    setTypedValue(undefined);
    setIsListVisible(false);
  };

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
        setTypedValue(undefined);
        setIsListVisible(false);
        setIsError(false);
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
        value={typedValue ?? value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setTypedValue(event.target.value);
          updateFilter(event.target.value);
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
              setTypedValue(undefined);
              setIsListVisible(false);
              setIsError(false);
            }
          }

          setIsFocused(false);
        }}
        label={name}
        error={isError}
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
