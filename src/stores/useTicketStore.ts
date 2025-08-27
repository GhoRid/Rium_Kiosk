import { create } from "zustand";

type TicektState = {
  hasTicket: boolean;
  setHasTicket: (price: boolean) => void;
};

export const useTicketStore = create<TicektState>((set) => ({
  hasTicket: false,
  setHasTicket: (ticket) => set({ hasTicket: ticket }),
}));
