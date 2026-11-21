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
        value: "Poochyena",
        options: data !== undefined ? data : [],
        min: 0,
        max: 0,
      },
    },
    {
      id: "level",
      name: "Level",
      inputType: "numeric",
      options: {
        min: 1,
        max: 100,
        value: "",
        options: [],
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
