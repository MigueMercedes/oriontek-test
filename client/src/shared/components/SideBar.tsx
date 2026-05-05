import { Box, Button, Stack, Typography } from "@mui/material";
import {
  Box as BoxIcon,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export const SIDEBAR_WIDTH = 240;

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clientes", icon: Users },
  { to: "/locations", label: "Direcciones", icon: MapPin },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleNewClient = () => {
    onNavigate?.();
    navigate("/clients/new");
  };

  const handleSupport = () => {
    enqueueSnackbar("Soporte: próximamente", { variant: "info" });
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        backgroundColor: "primary.main",
        color: "white",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1E293B",
      }}
    >
      {/* Brand */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", px: 2.5, pt: 3, pb: 2.5 }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.25,
            backgroundColor: "secondary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BoxIcon
            size={18}
            color="white"
          />
        </Box>
        <Box>
          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              lineHeight: 1.1,
            }}
          >
            OrionTek
          </Typography>
          <Typography
            sx={{
              color: "#64748B",
              fontWeight: 600,
              fontSize: "0.625rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mt: 0.25,
            }}
          >
            Enterprise CRM
          </Typography>
        </Box>
      </Stack>

      {/* Nav */}
      <Stack
        component="nav"
        sx={{ flex: 1, px: 1.5, gap: 0.25 }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.1,
                    borderRadius: 1,
                    color: isActive ? "white" : "rgba(255,255,255,0.7)",
                    backgroundColor: isActive
                      ? "rgba(37, 99, 235, 0.15)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid #2563EB"
                      : "3px solid transparent",
                    pl: isActive ? 1.25 : 1.5,
                    transition: "background-color 120ms, color 120ms",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.06)",
                      color: "white",
                    },
                  }}
                >
                  <Icon
                    size={18}
                    color={isActive ? "#2563EB" : "currentColor"}
                  />
                  <span>{item.label}</span>
                </Box>
              )}
            </NavLink>
          );
        })}
      </Stack>

      {/* Footer actions */}
      <Box sx={{ p: 1.5, borderTop: "1px solid #1E293B" }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<Plus size={16} />}
          onClick={handleNewClient}
          sx={{ mb: 1 }}
        >
          Nuevo cliente
        </Button>
        <Box
          component="button"
          onClick={handleSupport}
          sx={{
            all: "unset",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.8125rem",
            px: 1.25,
            py: 0.75,
            borderRadius: 1,
            "&:hover": {
              color: "white",
              backgroundColor: "rgba(255,255,255,0.06)",
            },
          }}
        >
          <HelpCircle size={15} />
          Soporte
        </Box>
      </Box>
    </Box>
  );
}
