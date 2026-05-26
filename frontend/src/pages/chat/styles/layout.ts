import type { SxProps, Theme } from "@mui/material/styles";

export const panelSx = {
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
} satisfies SxProps<Theme>;

export const panelHeaderSx = {
  px: 2,
  py: 1.5,
  borderBottom: "1px solid",
  borderColor: "divider",
} satisfies SxProps<Theme>;

export const scrollPanelSx = {
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
} satisfies SxProps<Theme>;
