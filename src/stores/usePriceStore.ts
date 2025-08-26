import { create } from "zustand";

type PriceState = {
  price: number | null;
  ticketId: string | null;
  usingCouponCode: string | null;
  setPrice: (price: number) => void;
  setTicketId: (id: string | null) => void; // <- null 허용 권장
  setUsingCouponCode: (code: string | null) => void;
};

export const usePriceStore = create<PriceState>((set) => ({
  price: null,
  ticketId: null,
  usingCouponCode: null,
  setPrice: (price) => set({ price }),
  setTicketId: (id) =>
    set((state) =>
      state.ticketId === id ? { ticketId: id } : { ticketId: id, price: null }
    ),
  setUsingCouponCode: (code) => set({ usingCouponCode: code }),
}));
