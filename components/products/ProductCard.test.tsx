import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";

// Mock next/link to render a simple anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("ProductCard", () => {
  const baseProduct: Product = {
    id: 1,
    name: "Test Laptop",
    description: "A powerful laptop for developers",
    price: "1299.99",
    category_id: 1,
    created_at: "2024-01-15T10:00:00.000Z",
  };

  it("renders product name", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Test Laptop")).toBeInTheDocument();
  });

  it("renders product description", () => {
    render(<ProductCard product={baseProduct} />);
    expect(
      screen.getByText("A powerful laptop for developers"),
    ).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("$1,299.99")).toBeInTheDocument();
  });

  it("links to product detail page", () => {
    render(<ProductCard product={baseProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/1");
  });

  it("handles null description gracefully", () => {
    const productWithoutDesc: Product = {
      ...baseProduct,
      description: null,
    };
    render(<ProductCard product={productWithoutDesc} />);
    expect(screen.getByText("Test Laptop")).toBeInTheDocument();
    expect(
      screen.queryByText("A powerful laptop for developers"),
    ).not.toBeInTheDocument();
  });

  it("formats integer price correctly", () => {
    const product: Product = {
      ...baseProduct,
      price: "50.00",
    };
    render(<ProductCard product={product} />);
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });
});
