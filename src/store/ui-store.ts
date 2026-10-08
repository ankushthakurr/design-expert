"use client";

import { create } from "zustand";
import type { BookingType } from "@/lib/site";

type Currency = "INR" | "USD";

type UIState = {
  bookingOpen: boolean;
  bookingType: BookingType;
  leadMagnetOpen: boolean;
  mobileNavOpen: boolean;
  currency: Currency;
  openBooking: (type?: BookingType) => void;
  closeBooking: () => void;
  openLeadMagnet: () => void;
  closeLeadMagnet: () => void;
  setMobileNav: (open: boolean) => void;
  setCurrency: (c: Currency) => void;
};

export const useUI = create<UIState>((set) => ({
  bookingOpen: false,
  bookingType: "consultation",
  leadMagnetOpen: false,
  mobileNavOpen: false,
  currency: "INR",
  openBooking: (type = "consultation") => set({ bookingOpen: true, bookingType: type, mobileNavOpen: false }),
  closeBooking: () => set({ bookingOpen: false }),
  openLeadMagnet: () => set({ leadMagnetOpen: true, mobileNavOpen: false }),
  closeLeadMagnet: () => set({ leadMagnetOpen: false }),
  setMobileNav: (open) => set({ mobileNavOpen: open }),
  setCurrency: (currency) => set({ currency }),
}));
