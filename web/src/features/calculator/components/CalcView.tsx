import { Container } from "@mui/material";
import { SelectList } from "../../../components/SelectList";
import type { EntrySummary } from "../../../types/types";

export default function CalcView() {
  const leftTitle = "Pokemon 1";
  const rightTitle = "Pokemon 2";

  const leftMoves: EntrySummary[] = [
    { id: "move1", name: "Move 1" },
    { id: "move2", name: "Move 2" },
    { id: "move3", name: "Move 3" },
    { id: "move4", name: "Move 4" },
  ];

  const rightMoves: EntrySummary[] = [
    { id: "move1", name: "Move 1" },
    { id: "move2", name: "Move 2" },
    { id: "move3", name: "Move 3" },
    { id: "move4", name: "Move 4" },
  ];

  return (
    <>
      <Container
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        <SelectList title={leftTitle} entries={leftMoves} />
        <SelectList title={rightTitle} entries={rightMoves} />
      </Container>
    </>
  );
}
