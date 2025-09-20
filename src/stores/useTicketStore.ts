import { create } from "zustand";

type TicketState = {
  hasTicket: boolean;
  setHasTicket: (ticket: boolean) => void;
  reset: () => void;
};

export const useTicketStore = create<TicketState>((set) => ({
  hasTicket: false,
  setHasTicket: (ticket) => set({ hasTicket: ticket }),
  reset: () => set({ hasTicket: false }),
}));
