
import { Product } from '../types';

const STORAGE_KEY = 'gestor_estoque_data';

export const storageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProducts: (products: Product[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'lastMovement'>): Product => {
    const products = storageService.getProducts();
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastMovement: new Date().toISOString(),
    };
    storageService.saveProducts([newProduct, ...products]);
    return newProduct;
  },

  updateProduct: (updatedProduct: Product): void => {
    const products = storageService.getProducts();
    const newProducts = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    storageService.saveProducts(newProducts);
  },

  deleteProduct: (id: string): void => {
    const products = storageService.getProducts();
    const newProducts = products.filter((p) => p.id !== id);
    storageService.saveProducts(newProducts);
  }
};
