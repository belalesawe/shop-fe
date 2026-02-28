export interface Inventory {
  productId: number;
  quantity: number;
  reserved: number;
  lastUpdated: string;
  productName?: string;
}

export interface InventoryUpdate {
  quantity: number;
}

export interface ReserveRequest {
  quantity: number;
}
