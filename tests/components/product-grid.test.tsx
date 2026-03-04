import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product One",
    description: "First product",
    price: "10.00",
    category_id: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Product Two",
    description: null,
    price: "20.00",
    category_id: null,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "Product Three",
    description: "Third product description",
    price: "30.00",
    category_id: 2,
    created_at: "2024-01-03T00:00:00Z",
  },
];

describe("ProductGrid", () => {
  it("renders all products in the grid", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(screen.getByText("Product Three")).toBeInTheDocument();
  });

  it("renders product prices", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$30.00")).toBeInTheDocument();
  });

  it("shows empty state when no products are provided", () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText("No products available.")).toBeInTheDocument();
  });

  it("shows custom empty message when provided", () => {
    render(
      <ProductGrid
        products={[]}
        emptyMessage="No items found in the store"
      />,
    );
    expect(
      screen.getByText("No items found in the store"),
    ).toBeInTheDocument();
  });

  it("renders the grid layout container with correct classes", () => {
    const { container } = render(<ProductGrid products={mockProducts} />);
    const grid = container.firstElementChild;
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("gap-6");
  });

  it("renders descriptions for products that have them", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText("First product")).toBeInTheDocument();
    expect(screen.getByText("Third product description")).toBeInTheDocument();
  });
});
