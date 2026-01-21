
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  lastMovement: string;
}

export type MovementType = 'IN' | 'OUT';

export interface MovementRecord {
  id: string;
  productId: string;
  type: MovementType;
  amount: number;
  date: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
}
