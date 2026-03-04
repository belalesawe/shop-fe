import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "@/components/header";

describe("Header", () => {
  it("renders the shop title", () => {
    render(<Header />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Shop",
    );
  });

  it("renders a header element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("applies the correct styling classes", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("border-b");
    expect(header).toHaveClass("bg-white");
  });
});
