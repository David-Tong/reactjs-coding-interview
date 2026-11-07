import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import App from "./App";
import { USERS } from "./types";

describe("App", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Initial Render - Page 1", () => {
    beforeEach(() => {
      cleanup();
      render(<App />);
    });

    it("displays exactly 5 users on the first page", () => {
      const users = screen.getAllByRole("listitem");
      expect(users).toHaveLength(5);
    });

    it("displays the first 5 users in correct order", () => {
      const users = screen.getAllByRole("listitem");
      expect(users[0].textContent).toContain("David");
      expect(users[1].textContent).toContain("Alice");
      expect(users[2].textContent).toContain("Bob");
      expect(users[3].textContent).toContain("Charlie");
      expect(users[4].textContent).toContain("Emma");
    });

    it("displays all user information (name, email, age)", () => {
      const firstUser = screen.getAllByRole("listitem")[0];
      expect(firstUser.textContent).toContain("Name : David");
      expect(firstUser.textContent).toContain("Email : david@example.com");
      expect(firstUser.textContent).toContain("Age : 28");
    });

    it("displays current page number as Page 1", () => {
      const pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 1");
    });

    it("disables Previous button on first page", () => {
      const prevButton = screen.getByRole("button", { name: "Previous" });
      expect(prevButton.hasAttribute("disabled")).toBe(true);
    });

    it("enables Next button on first page", () => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton.hasAttribute("disabled")).toBe(false);
    });
  });

  describe("Navigation - Forward", () => {
    beforeEach(() => {
      cleanup();
      render(<App />);
    });

    it("navigates to page 2 and displays correct users", () => {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      const users = screen.getAllByRole("listitem");
      expect(users).toHaveLength(5);
      const pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 2");
      expect(users[0].textContent).toContain("Frank");
      expect(users[1].textContent).toContain("Grace");
      expect(users[2].textContent).toContain("Henry");
      expect(users[3].textContent).toContain("Ivy");
      expect(users[4].textContent).toContain("Jack");
    });

    it("enables Previous button on page 2", () => {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      const prevButton = screen.getByRole("button", { name: "Previous" });
      expect(prevButton.hasAttribute("disabled")).toBe(false);
    });

    it("enables Next button on page 2", () => {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton.hasAttribute("disabled")).toBe(false);
    });
  });

  describe("Navigation - Last Page", () => {
    beforeEach(() => {
      cleanup();
      render(<App />);
      // Navigate to page 4 (last page)
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    });

    it("displays remaining users on last page", () => {
      const users = screen.getAllByRole("listitem");
      const totalUsers = USERS.length;
      const pageSize = 5;
      const expectedLastPageSize = totalUsers % pageSize;
      expect(users).toHaveLength(expectedLastPageSize);
    });

    it("displays correct users on last page", () => {
      const users = screen.getAllByRole("listitem");
      const pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 4");
      expect(users[0].textContent).toContain("Peter");
      expect(users[1].textContent).toContain("Sophia");
      expect(users[2].textContent).toContain("William");
    });

    it("disables Next button on last page", () => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton.hasAttribute("disabled")).toBe(true);
    });

    it("enables Previous button on last page", () => {
      const prevButton = screen.getByRole("button", { name: "Previous" });
      expect(prevButton.hasAttribute("disabled")).toBe(false);
    });
  });

  describe("Navigation - Back and Forth", () => {
    beforeEach(() => {
      cleanup();
      render(<App />);
    });

    it("navigates forward then back to original page", () => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      const prevButton = screen.getByRole("button", { name: "Previous" });

      fireEvent.click(nextButton);
      let pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 2");

      fireEvent.click(prevButton);
      pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 1");
      const users = screen.getAllByRole("listitem");
      expect(users[0].textContent).toContain("David");
    });

    it("navigates multiple pages forward then back", () => {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      let pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 3");

      fireEvent.click(screen.getByRole("button", { name: "Previous" }));
      pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 2");
      let users = screen.getAllByRole("listitem");
      expect(users[0].textContent).toContain("Frank");

      fireEvent.click(screen.getByRole("button", { name: "Previous" }));
      pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 1");
      users = screen.getAllByRole("listitem");
      expect(users[0].textContent).toContain("David");
    });
  });

  describe("Button Behavior", () => {
    beforeEach(() => {
      cleanup();
      render(<App />);
    });

    it("Previous button type is 'button'", () => {
      const prevButton = screen.getByRole("button", { name: "Previous" });
      expect(prevButton.getAttribute("type")).toBe("button");
    });

    it("Next button type is 'button'", () => {
      const nextButton = screen.getByRole("button", { name: "Next" });
      expect(nextButton.getAttribute("type")).toBe("button");
    });

    it("clicking Previous button multiple times on first page does not change page", () => {
      const prevButton = screen.getByRole("button", { name: "Previous" });
      expect(prevButton.hasAttribute("disabled")).toBe(true);
      const pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 1");
    });
  });

  describe("Pagination Logic", () => {
    it("calculates correct total pages", () => {
      cleanup();
      render(<App />);
      const totalUsers = USERS.length;
      const pageSize = 5;
      const expectedPages = Math.ceil(totalUsers / pageSize);
      expect(expectedPages).toBe(4);
    });

    it("renders all users across all pages", () => {
      cleanup();
      render(<App />);
      const pageSize = 5;
      const totalUsers = USERS.length;
      const totalPages = Math.ceil(totalUsers / pageSize);

      const allUsersDisplayed = new Set<string>();

      for (let page = 1; page <= totalPages; page++) {
        const users = screen.getAllByRole("listitem");
        users.forEach((user) => {
          const match = user.textContent?.match(/Name : ([^,]+)/);
          if (match) {
            allUsersDisplayed.add(match[1]);
          }
        });

        if (page < totalPages) {
          fireEvent.click(screen.getByRole("button", { name: "Next" }));
        }
      }

      expect(allUsersDisplayed.size).toBe(totalUsers);
    });
  });

  describe("Data Display", () => {
    beforeEach(() => {
      cleanup();
      render(<App />);
    });

    it("displays email for each user", () => {
      const users = screen.getAllByRole("listitem");
      users.forEach((user) => {
        expect(user.textContent).toMatch(/Email : .+@.+\..+/);
      });
    });

    it("displays age for each user", () => {
      const users = screen.getAllByRole("listitem");
      users.forEach((user) => {
        expect(user.textContent).toMatch(/Age : \d+/);
      });
    });

    it("renders users in list items", () => {
      const users = screen.getAllByRole("listitem");
      expect(users.length).toBeGreaterThan(0);
      users.forEach((user) => {
        expect(user.tagName).toBe("LI");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles transition from page 3 to page 4", () => {
      cleanup();
      render(<App />);
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
      fireEvent.click(screen.getByRole("button", { name: "Next" }));

      const users = screen.getAllByRole("listitem");
      expect(users).toHaveLength(3);
      const pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 4");
    });

    it("maintains page state through multiple rapid clicks", () => {
      cleanup();
      render(<App />);
      const nextButton = screen.getByRole("button", { name: "Next" });

      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const pageSpan = screen.getAllByText(/Page/)[0];
      expect(pageSpan.textContent).toBe("Page 3");
    });
  });
});
