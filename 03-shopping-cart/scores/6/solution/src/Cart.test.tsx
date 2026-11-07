import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Cart from "./Cart";
import { CartItem } from "./types";

afterEach(cleanup);

const cartItems: CartItem[] = [
  { product: { name: "Java", price: 10 }, quantity: 2 },
  { product: { name: "Python", price: 8 }, quantity: 0 },
  { product: { name: "React.js", price: 5 }, quantity: 3 },
];

describe("Cart", () => {
  it.each([
    { scenario: "no items", items: [] },
    { scenario: "only zero quantities", items: cartItems.map((item) => ({ ...item, quantity: 0 })) },
  ])("shows the empty state with $scenario", ({ items }) => {
      render(<Cart cartItems={items} onDelete={vi.fn()} />);

      expect(screen.getByText("The Cart is empty.")).toBeTruthy();
      expect(screen.queryByRole("table")).toBeNull();
      expect(screen.queryByRole("button")).toBeNull();
      expect(screen.queryByText(/^Total \$/)).toBeNull();
  });

  it("displays product details for items with a positive quantity", () => {
    render(<Cart cartItems={cartItems} onDelete={vi.fn()} />);

    const table = within(screen.getByRole("table", { name: "Cart" }));
    const rows = table.getAllByRole("row").slice(1);

    const details = rows.map((row) =>
      within(row).getAllByRole("cell").map((cell) => cell.textContent),
    );
    expect(details).toEqual([
      ["Java", "10", "2", "Remove a cart item"],
      ["React.js", "5", "3", "Remove a cart item"],
    ]);
    expect(table.queryByText("Python")).toBeNull();
    expect(screen.queryByText("The Cart is empty.")).toBeNull();
  });

  it("totals the price times quantity across all cart items", () => {
    render(<Cart cartItems={cartItems} onDelete={vi.fn()} />);

    expect(screen.getByText("Total $35")).toBeTruthy();
  });

  it("calls onDelete with the selected product name", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Cart cartItems={cartItems} onDelete={onDelete} />);

    const row = screen.getByRole("row", { name: "React.js 5 3 Remove a cart item" });
    await user.click(within(row).getByRole("button", { name: "Remove a cart item" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("React.js");
  });
});
