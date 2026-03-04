import type { components } from "@/lib/api/schema";

export type Product = components["schemas"]["ProductResponse"];
export type Category = components["schemas"]["CategoryResponse"];
export type ProductCreate = components["schemas"]["ProductCreate"];
export type ProductUpdate = components["schemas"]["ProductUpdate"];
export type CategoryCreate = components["schemas"]["CategoryCreate"];
export type CategoryUpdate = components["schemas"]["CategoryUpdate"];
