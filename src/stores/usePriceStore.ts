import { create } from "zustand";

type PriceState = {
  price: number | null;
  ticketId: string | null;
  usingCouponCode: string | null;
  setPrice: (price: number) => void;
  setTicketId: (id: string) => void;
  setUsingCouponCode: (code: string | null) => void;
};

export const usePriceStore = create<PriceState>((set) => ({
  price: null,
  ticketId: null,
  usingCouponCode: null,
  setPrice: (price) => set({ price }),
  setTicketId: (id) => set({ ticketId: id }),
  setUsingCouponCode: (code) => set({ usingCouponCode: code }),
}));
