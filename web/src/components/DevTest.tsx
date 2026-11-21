import { Button, Stack } from "@mui/material";
import { useSpecies } from "../api/queries";
import { SelectInputField } from "./SelectInputField";
import React from "react";
import type { EntrySummary } from "../types/types";

function TestParent({ options }: { options: EntrySummary[] }) {
  const [name, setName] = React.useState("Poochyena");

  return (
    <>
      <SelectInputField
        value={name}
        name="Species"
        options={options}
        onSelectEntry={(entry) => setName(entry.name)}
      />
      <Button onClick={() => setName("Zubat")}>Test Zubat</Button>
    </>
  );
}

export function DevTest() {
  const { status, data, error } = useSpecies();

  if (status === "pending") return "Loading...";
  if (status === "error") return <span>Error: {error.message}</span>;

  return (
    <>
      <Stack>
        <div>DevTest</div>
        <TestParent options={data} />
      </Stack>
    </>
  );
}
