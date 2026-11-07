import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { register } from "./apis";

vi.mock("./apis", () => ({
  register: vi.fn(),
}));

const mockedRegister = vi.mocked(register);

function getRegistrationFields() {
  const [name, email] = screen.getAllByRole("textbox");
  // Password inputs have no implicit ARIA role; locate them beside their labels.
  const password = screen.getByText("Password", { selector: "label" })
    .parentElement!.querySelector("input")!;
  const repassword = screen.getByText("Password Again", { selector: "label" })
    .parentElement!.querySelector("input")!;
  return { name, email, password, repassword };
}

function fillRegistrationForm() {
  const { name, email, password, repassword } = getRegistrationFields();

  fireEvent.change(name, { target: { value: "Ada Lovelace" } });
  fireEvent.change(email, { target: { value: "ada@example.com" } });
  fireEvent.change(password, { target: { value: "secret123" } });
  fireEvent.change(repassword, { target: { value: "secret123" } });
}

function submitForm() {
  fireEvent.click(screen.getByRole("button", { name: "Register" }));
}

function expectMessages(expected: string[]) {
  const fields = Object.values(getRegistrationFields());
  fields.forEach((field, index) => {
    const container = field.parentElement!;
    const label = container.querySelector("label")!;
    // Include the label so empty expectations also check that old errors cleared.
    expect(container.textContent).toBe(`${label.textContent}${expected[index]}`);
  });
  expect(screen.getByRole("paragraph").textContent).toBe(expected[4]);
}

describe("registration form", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockedRegister.mockReset();
  });

  it("reports all invalid fields and clears corrected errors on resubmission", () => {
    render(<App />);

    submitForm();
    const { name, email, password } = getRegistrationFields();
    expectMessages([
      "Name can't be empty",
      "Email must be valid",
      "Password can't be empty",
      "Password again can't be empty",
      "",
    ]);

    fireEvent.change(name, { target: { value: "Ada Lovelace" } });
    submitForm();
    expectMessages([
      "", "Email must be valid", "Password can't be empty",
      "Password again can't be empty", "",
    ]);

    fireEvent.change(email, { target: { value: "ada@example.com" } });
    submitForm();
    expectMessages([
      "", "", "Password can't be empty", "Password again can't be empty", "",
    ]);

    fireEvent.change(password, { target: { value: "secret123" } });
    submitForm();
    expectMessages([
      "", "", "", "Password input twice must be equal", "",
    ]);
    expect(mockedRegister).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    render(<App />);
    fillRegistrationForm();
    fireEvent.change(getRegistrationFields().repassword, {
      target: { value: "different-password" },
    });

    submitForm();

    expectMessages([
      "", "", "", "Password input twice must be equal", "",
    ]);
    expect(mockedRegister).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it.each(["not-an-email", "ada@example", "ada example@example.com"])("rejects invalid email %s", (email) => {
    render(<App />);
    fillRegistrationForm();
    fireEvent.change(getRegistrationFields().email, {
      target: { value: email },
    });

    submitForm();

    expectMessages(["", "Email must be valid", "", "", ""]);
    expect(mockedRegister).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("rejects whitespace-only required fields", () => {
    render(<App />);
    Object.values(getRegistrationFields()).forEach((field) => {
      fireEvent.change(field, { target: { value: "   " } });
    });

    submitForm();

    expectMessages([
      "Name can't be empty", "Email must be valid", "Password can't be empty",
      "Password again can't be empty", "",
    ]);
    expect(mockedRegister).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("submits valid user details and displays a successful response", async () => {
    mockedRegister.mockResolvedValue({
      message: "Ada Lovelace registered",
      status: "ok",
    });
    render(<App />);
    fillRegistrationForm();

    submitForm();

    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(true);
    expect(mockedRegister).toHaveBeenCalledTimes(1);
    expect(mockedRegister).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });
    await waitFor(() => {
      expectMessages(["", "", "", "", "Ada Lovelace registered"]);
      expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
    });
  });

  it("prevents duplicate submissions while registration is pending", async () => {
    let resolveRegistration!: (response: { message: string; status: "ok" }) => void;
    mockedRegister.mockReturnValue(new Promise((resolve) => {
      resolveRegistration = resolve;
    }));
    render(<App />);
    fillRegistrationForm();

    submitForm();
    submitForm();

    expect(mockedRegister).toHaveBeenCalledTimes(1);
    expectMessages(["", "", "", "", "Submitting ..."]);
    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(true);
    await act(async () => {
      resolveRegistration({ message: "Registered", status: "ok" });
    });
    expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("displays a failed registration response", async () => {
    mockedRegister.mockRejectedValue({
      message: "Ada Lovelace unable to register",
      status: "failed",
    });
    render(<App />);
    fillRegistrationForm();

    submitForm();

    await waitFor(() => {
      expectMessages([
        "", "", "", "", "Ada Lovelace unable to register",
      ]);
      expect((screen.getByRole("button", { name: "Register" }) as HTMLButtonElement).disabled).toBe(false);
    });
  });
});
