import { http, HttpResponse } from "msw";
import type { components } from "@/lib/api/schema";

type ProductResponse = components["schemas"]["ProductResponse"];

export const mockProducts: ProductResponse[] = [
  {
    id: 1,
    name: "Test Product 1",
    description: "A great test product",
    price: "29.99",
    category_id: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Test Product 2",
    description: null,
    price: "49.99",
    category_id: null,
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "Test Product 3",
    description: "Another product with a description",
    price: "99.99",
    category_id: 2,
    created_at: "2024-01-03T00:00:00Z",
  },
];

export const handlers = [
  http.get("http://localhost:8000/products", () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get("http://localhost:8000/products/:productId", ({ params }) => {
    const product = mockProducts.find(
      (p) => p.id === Number(params.productId),
    );
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.get("http://localhost:8000/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics", description: "Electronic devices" },
      { id: 2, name: "Books", description: null },
    ]);
  }),
];
