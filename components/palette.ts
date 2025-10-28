export const PALETTE = {
  sky: "#80c1dd",
  rose: "#f2aadc",
  lime: "#dcf2aa",
  lavender: "#c0aaf2",
  ink: "#1d1b29",
  paper: "#fbfafc",
} as const;

export type PaletteKey = keyof typeof PALETTE;
