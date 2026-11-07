import { afterEach, describe, expect, it, vi } from "vitest";
import { register } from "./apis";

describe("register", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("resolves with a successful response after the delay", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.8);

    const result = register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });

    await vi.advanceTimersByTimeAsync(300);

    await expect(result).resolves.toEqual({
      message: "Ada Lovelace registerred",
      status: "ok",
    });
  });

  it("rejects with a failure response after the delay", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValueOnce(0.1).mockReturnValueOnce(0.9);

    const result = register({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret123",
    });
    const rejection = expect(result).rejects.toEqual({
      message: "Ada Lovelace unable to register",
      status: "failed",
    });

    await vi.advanceTimersByTimeAsync(370);

    await rejection;
  });
});
