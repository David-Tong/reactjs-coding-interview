import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Listings from "./Listings";
import { Listing } from "./types";

afterEach(cleanup);

const listings: Listing[] = [
  { product: { name: "Java", price: 10 }, quantity: 2 },
  { product: { name: "Python", price: 8 }, quantity: 0 },
  { product: { name: "React.js", price: 5 }, quantity: -1 },
];

describe("Listings", () => {
  it("displays product details only for listings with stock", () => {
    render(<Listings listings={listings} onAdd={vi.fn()} />);

    const table = within(screen.getByRole("table"));

    expect(table.getByRole("heading", { name: "Listings" })).toBeTruthy();
    expect(table.getByText("Java")).toBeTruthy();
    expect(table.getByText("10")).toBeTruthy();
    expect(table.getByText("2")).toBeTruthy();
    expect(table.queryByText("Python")).toBeNull();
    expect(table.queryByText("React.js")).toBeNull();
  });

  it("calls onAdd with the selected product name", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<Listings listings={listings} onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Add a product" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith("Java");
  });
});
