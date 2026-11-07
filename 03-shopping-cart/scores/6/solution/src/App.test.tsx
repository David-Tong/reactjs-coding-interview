import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./types", () => ({
  LISTINGS: [
    { product: { name: "Java", price: 10 }, quantity: 2 },
    { product: { name: "React.js", price: 5 }, quantity: 1 },
  ],
  CARTITEMS: [
    { product: { name: "Java", price: 10 }, quantity: 0 },
    { product: { name: "React.js", price: 5 }, quantity: 0 },
  ],
}));

import App from "./App";

afterEach(cleanup);

function getTable(title: string) {
  return within(screen.getByRole("table", { name: title }));
}

function getRow(table: ReturnType<typeof within>, name: string) {
  const row = table.getByText(name).closest("tr");

  if (!row) {
    throw new Error(`Could not find a row for ${name}`);
  }

  return within(row);
}

function expectJavaRow(title: string, quantity: number, action: string) {
  const cells = getRow(getTable(title), "Java").getAllByRole("cell");
  expect(cells.map((cell) => cell.textContent)).toEqual([
    "Java",
    "10",
    String(quantity),
    action,
  ]);
}

describe("shopping cart", () => {
  it("adds a product to the cart and decreases its available quantity", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("The Cart is empty.")).toBeTruthy();
    expect(screen.queryByRole("table", { name: "Cart" })).toBeNull();

    await user.click(
      getRow(getTable("Listings"), "Java").getByRole("button", {
        name: "Add a product",
      }),
    );

    expectJavaRow("Listings", 1, "Add a product");
    expectJavaRow("Cart", 1, "Remove a cart item");
    expect(screen.queryByText("The Cart is empty.")).toBeNull();
    expect(screen.getByText("Total $10")).toBeTruthy();
  });

  it("restores product stock when the cart item is deleted", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      getRow(getTable("Listings"), "Java").getByRole("button", {
        name: "Add a product",
      }),
    );
    await user.click(
      getRow(getTable("Cart"), "Java").getByRole("button", {
        name: "Remove a cart item",
      }),
    );

    expectJavaRow("Listings", 2, "Add a product");
    expect(screen.queryByRole("table", { name: "Cart" })).toBeNull();
    expect(screen.getByText("The Cart is empty.")).toBeTruthy();
    expect(screen.queryByText(/^Total \$/)).toBeNull();
  });

  it("hides products with no remaining stock and shows them again after deletion", async () => {
    const user = userEvent.setup();
    render(<App />);

    const products = getTable("Listings");
    const javaProduct = getRow(products, "Java");

    await user.click(
      javaProduct.getByRole("button", { name: "Add a product" }),
    );
    await user.click(
      javaProduct.getByRole("button", { name: "Add a product" }),
    );

    expect(products.queryByText("Java")).toBeNull();
    expectJavaRow("Cart", 2, "Remove a cart item");
    expect(screen.getByText("Total $20")).toBeTruthy();

    await user.click(
      getRow(getTable("Cart"), "Java").getByRole("button", {
        name: "Remove a cart item",
      }),
    );

    expectJavaRow("Listings", 1, "Add a product");
    expectJavaRow("Cart", 1, "Remove a cart item");
    expect(screen.getByText("Total $10")).toBeTruthy();
  });
});
