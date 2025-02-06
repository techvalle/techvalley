// store/productStore.ts

import { create } from "zustand";

interface ProductStore {
  currentProduct: any | null;
  setCurrentProduct: (product: any) => void;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  currentProduct: null,
  setCurrentProduct: (product) => set({ currentProduct: product }),
  clearCurrentProduct: () => set({ currentProduct: null }),
}));
