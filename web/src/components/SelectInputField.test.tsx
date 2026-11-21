import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectInputField } from "./SelectInputField";
import type { EntrySummary } from "../types/types";

const options: EntrySummary[] = [
  { id: "abomasnow", name: "Abomasnow" },
  { id: "abra", name: "Abra" },
  { id: "poochyena", name: "Poochyena" },
  { id: "zubat", name: "Zubat" },
];

// Small parent: holds the value, like the real config tab will
function Harness({ onSelect }: { onSelect?: (e: EntrySummary) => void }) {
  const [name, setName] = React.useState("Poochyena");
  return (
    <>
      <SelectInputField
        value={name}
        name="Species"
        options={options}
        onSelectEntry={(entry) => {
          setName(entry.name);
          onSelect?.(entry);
        }}
      />
      <button onClick={() => setName("Zubat")}>external</button>
    </>
  );
}

function setup(onSelect = vi.fn()) {
  const user = userEvent.setup();
  render(<Harness onSelect={onSelect} />);
  const input = screen.getByLabelText("Species");
  return { user, input, onSelect };
}

describe("SelectInputField", () => {
  it("shows the parent value and does nothing when tabbing through", async () => {
    const { user, input, onSelect } = setup();
    await user.tab(); // focus the field
    await user.tab(); // leave it
    expect(input).toHaveValue("Poochyena");
    expect(input).not.toBeInvalid();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("counts a fully typed name as a pick on blur, with corrected case", async () => {
    const { user, input, onSelect } = setup();
    await user.clear(input);
    await user.type(input, "abra");
    await user.tab();
    expect(onSelect).toHaveBeenCalledWith(options[1]);
    expect(input).toHaveValue("Abra");
    expect(
      screen.queryByRole("button", { name: "Abra" }),
    ).not.toBeInTheDocument();
  });

  it("reverts incomplete text on blur", async () => {
    const { user, input, onSelect } = setup();
    await user.clear(input);
    await user.type(input, "Ab");
    await user.tab();
    expect(input).toHaveValue("Poochyena");
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("is red while nothing matches and not red after reverting", async () => {
    const { user, input } = setup();
    await user.clear(input);
    await user.type(input, "zzz");
    expect(input).toBeInvalid();
    await user.tab();
    expect(input).not.toBeInvalid();
    expect(input).toHaveValue("Poochyena");
  });

  it("picks an entry with the mouse, exactly once", async () => {
    const { user, input, onSelect } = setup();
    await user.clear(input);
    await user.type(input, "Ab");
    await user.click(screen.getByRole("button", { name: "Abra" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(options[1]);
    expect(input).toHaveValue("Abra");
    expect(input).not.toBeInvalid();
  });

  it("picks the highlighted entry with Enter and moves with arrows", async () => {
    const { user, input, onSelect } = setup();
    await user.clear(input);
    await user.type(input, "Ab");
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(options[0]);

    await user.clear(input);
    await user.type(input, "Ab");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenLastCalledWith(options[1]);
  });

  it("drops the typed text on Escape and keeps the list closed", async () => {
    const { user, input } = setup();
    await user.clear(input);
    await user.type(input, "Zu");
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("Poochyena");
    expect(
      screen.queryByRole("button", { name: "Zubat" }),
    ).not.toBeInTheDocument();
    await user.tab();
    await user.click(input);
    expect(
      screen.queryByRole("button", { name: "Zubat" }),
    ).not.toBeInTheDocument();
  });

  it("reverts after the text was deleted completely", async () => {
    const { user, input } = setup();
    await user.clear(input);
    await user.tab();
    expect(input).toHaveValue("Poochyena");
  });

  it("follows a value change from the parent", async () => {
    const { user, input } = setup();
    await user.clear(input);
    await user.type(input, "Ab");
    await user.click(screen.getByRole("button", { name: "Abra" }));
    await user.click(screen.getByRole("button", { name: "external" }));
    expect(input).toHaveValue("Zubat");
  });
});
