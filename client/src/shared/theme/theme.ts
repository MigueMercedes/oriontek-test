import { createTheme } from "@mui/material";

// MUI does NOT support "tertiary" or "neutral" directly in palette, nor "label" typography, nor "containedPrimary" override keys.
// Adjusted to be MUI-valid, but maintains as much design fidelity as possible.

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F172A",
      light: "#256DEB",
      dark: "#0B1120",
      contrastText: "#fff",
    },
    secondary: {
      main: "#256DEB",
      light: "#60A5FA",
      dark: "#1E40AF",
      contrastText: "#fff",
    },
    // "neutral" as a custom color via "grey"
    grey: {
      50: "#F5F6FC", // lightest
      100: "#fff",
      200: "#E5E7EB", // used for outlines/borders
      900: "#111827",
    },
    background: {
      default: "#F5F6FC",
      paper: "#fff",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    // Tertiary could be mapped to 'info'
    info: {
      main: "#64748B",
      light: "#94A3B8",
      dark: "#334155",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica Neue", Arial, sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: "2.25rem",
      letterSpacing: 0,
      color: "#0F172A",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.5rem",
      letterSpacing: 0,
      color: "#0F172A",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
      color: "#64748B",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      color: "#64748B",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
      color: "#0F172A",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      color: "#64748B",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none",
      color: "#0F172A",
    },
    // "label" not officially part of MUI typography variants.
    // Custom typography variants must be configured with module augmentation if needed.
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          // Handles both primary and secondary
          boxShadow: "none",
        },
        outlined: {
          borderColor: "#64748B",
          color: "#0F172A",
        },
        text: {
          color: "#256DEB",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          borderRadius: 8,
        },
        notchedOutline: {
          borderColor: "#E5E7EB",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#64748B",
        },
      },
    },
  },
});

export default theme;