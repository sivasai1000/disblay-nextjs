"use client";

import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  cart: { items: [], type: null },
  setCart: (data) => set({ cart: data }),
  business: null,
  setBusiness: (data) => set({ business: data }),
}));
