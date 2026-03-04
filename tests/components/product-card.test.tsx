import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

const baseProduct: Product = {
  id: 1,
  name: "Test Product",
  description: "A wonderful test product",
  price: "29.99",
  category_id: 1,
  created_at: "2024-01-01T00:00:00Z",
};

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Product",
    );
  });

  it("renders the product price", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders the product description when provided", () => {
    render(<ProductCard product={baseProduct} />);
    expect(
      screen.getByText("A wonderful test product"),
    ).toBeInTheDocument();
  });

  it("does not render description when it is null", () => {
    const productWithoutDescription: Product = {
      ...baseProduct,
      description: null,
    };
    render(<ProductCard product={productWithoutDescription} />);
    expect(screen.queryByText("A wonderful test product")).not.toBeInTheDocument();
    // Ensure no paragraph element for description exists
    const heading = screen.getByRole("heading", { level: 2 });
    const nextSibling = heading.nextElementSibling;
    // The next sibling should be the price div, not a description paragraph
    expect(nextSibling?.tagName).toBe("DIV");
  });

  it("renders within a card container", () => {
    const { container } = render(<ProductCard product={baseProduct} />);
    const card = container.firstElementChild;
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("border");
  });
});
