import { Product } from "@/types/appwriteTypes";
import { create } from "zustand";

interface EditStore {
  productData: Product; // Replace `any` with the appropriate type if available
  setProductData: (data: Product) => void;
  clearProductData: () => void;
}

export const useEditStore = create<EditStore>((set) => ({
  productData: {} as Product,
  setProductData: (data) => set({ productData: data }),
  clearProductData: () => set({ productData: {} as Product }),
}));
