import { Stack } from "@mui/material";
import { useSpecies } from "../api/queries";

export function DevTest() {
  const { status, data, error, isFetching } = useSpecies();

  if (status === "pending") return "Loading...";
  if (status === "error") return <span>Error: {error.message}</span>;

  return (
    <>
      <Stack>
        <div>DevTest</div>
        <div>
          <ul>
            {data.map((specie) => (
              <li key={specie.id}>{specie.name}</li>
            ))}
          </ul>
        </div>
        <div>{isFetching ? "Background Updating..." : " "}</div>
      </Stack>
    </>
  );
}
