import { IBM_Plex_Mono } from "next/font/google";

/**
 * IBM Plex Mono 500 for the homepage eyebrows (SISTEMSKA PLAST, KAJ DELAMO, IZBRANO DELO, VAŠ PROJEKT, KONTAKT).
 * Imported by `app/(sl)/page.tsx` only, so only the homepage requests it: one weight, latin + latin-ext (Slovenian č š ž).
 * The class `homeMono.variable` on the homepage wrapper defines `--font-mono-home`, which `app/homeTypography.css` reads.
 * The family name is unique, so it cannot collide with Inter or DM Serif Display.
 */
export const homeMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: "500",
  variable: "--font-mono-home",
  display: "swap",
});
