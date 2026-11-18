import { useSpecies } from "../../../api/queries";
import { InputList } from "../../../components/InputList";
import type { IInputListRow } from "../../../types/types";

export default function ConfigBasicsTab() {
  const { status, data, error, isFetching } = useSpecies();

  const basicsRows: IInputListRow[] = [
    {
      id: "name",
      name: "Name",
      inputType: "select",
      options: {
        initial: "",
        options: data !== undefined ? data.map((d) => d.name) : [],
      },
    },
    {
      id: "level",
      name: "Level",
      inputType: "numeric",
      options: {
        min: 0,
        max: 100,
      },
    },
  ];

  if (status === "pending") return "Loading...";
  if (status === "error") return <span>Error: {error.message}</span>;

  return (
    <>
      {isFetching ? "Background Updating..." : <InputList rows={basicsRows} />}
    </>
  );
}
