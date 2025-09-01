import { create } from "zustand";

type PriceState = {
  price: number | null;
  ticketId: string | null;
  usingCouponCode: string | null;
  setPrice: (price: number | null) => void;
  setTicketId: (id: string | null) => void;
  setUsingCouponCode: (code: string | null) => void;
};

export const usePriceStore = create<PriceState>((set) => ({
  price: null,
  ticketId: null,
  usingCouponCode: null,
  setPrice: (price) => set({ price }),
  setTicketId: (id) =>
    set((state) =>
      state.ticketId === id
        ? { ticketId: id }
        : { ticketId: id, price: null, usingCouponCode: null }
    ),
  setUsingCouponCode: (code) => set({ usingCouponCode: code }),
}));
