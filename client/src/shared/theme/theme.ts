import { createTheme } from "@mui/material";

const NAVY = "#0F172A";
const TECH_BLUE = "#0051D5";
const TECH_BLUE_LIGHT = "#2563EB";
const BORDER = "#E2E8F0";
const PAPER_BORDER = "#E5E7EB";
const TEXT_PRIMARY = "#191C1E";
const TEXT_SECONDARY = "#45464D";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: NAVY,
      light: "#1E293B",
      dark: "#0B1120",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: TECH_BLUE,
      light: TECH_BLUE_LIGHT,
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    grey: {
      50: "#F7F9FB",
      100: "#F1F5F9",
      200: BORDER,
      300: "#CBD5E1",
      500: "#64748B",
      700: "#334155",
      900: "#0F172A",
    },
    background: {
      default: "#F7F9FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    divider: BORDER,
    info: {
      main: TECH_BLUE,
      light: TECH_BLUE_LIGHT,
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#16A34A",
      light: "#22C55E",
      dark: "#15803D",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D97706",
      light: "#F59E0B",
      dark: "#B45309",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica Neue", Arial, sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: "1.875rem",
      letterSpacing: "-0.02em",
      color: TEXT_PRIMARY,
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.5rem",
      letterSpacing: "-0.01em",
      color: TEXT_PRIMARY,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: TEXT_PRIMARY,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.125rem",
      color: TEXT_PRIMARY,
    },
    body1: {
      fontWeight: 400,
      fontSize: "0.9375rem",
      color: TEXT_PRIMARY,
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      color: TEXT_SECONDARY,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
      color: TEXT_PRIMARY,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      color: TEXT_SECONDARY,
    },
    caption: {
      fontWeight: 500,
      fontSize: "0.75rem",
      letterSpacing: "0.05em",
      color: TEXT_SECONDARY,
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none",
      letterSpacing: 0,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F7F9FB",
          color: TEXT_PRIMARY,
        },
        "*::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#CBD5E1",
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          textTransform: "none",
          paddingInline: 14,
          minHeight: 36,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderColor: BORDER,
          color: TEXT_PRIMARY,
          backgroundColor: "#FFFFFF",
          "&:hover": {
            borderColor: "#CBD5E1",
            backgroundColor: "#F8FAFC",
          },
        },
        text: {
          color: TECH_BLUE,
          "&:hover": { backgroundColor: "rgba(0,81,213,0.06)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: 6,
          minHeight: 36,
          "& .MuiOutlinedInput-input": {
            paddingTop: 8,
            paddingBottom: 8,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: BORDER,
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CBD5E1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: TECH_BLUE,
            borderWidth: 1,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#DC2626",
          },
        },
        notchedOutline: {
          borderColor: BORDER,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: TEXT_SECONDARY,
          "&.Mui-focused": { color: TECH_BLUE },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${PAPER_BORDER}`,
          backgroundImage: "none",
          boxShadow: "none",
        },
        elevation0: { boxShadow: "none" },
        elevation1: { boxShadow: "none" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${PAPER_BORDER}`,
          boxShadow: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${BORDER}`,
        },
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          color: TEXT_SECONDARY,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          backgroundColor: "#F8FAFC",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: TEXT_SECONDARY,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${PAPER_BORDER}`,
          boxShadow:
            "0px 4px 16px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.04)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: NAVY,
          fontSize: "0.75rem",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: BORDER },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
