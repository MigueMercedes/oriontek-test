import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Bell, LogOut, Menu as MenuIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../features/auth/store";
import { getAvatarColor, getInitials } from "../lib/avatar";
import { useSearchStore } from "../state/searchStore";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const HEADER_HEIGHT = 64;

export default function Header({ onOpenSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clear);

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  // Search only applies on /clients; reset when navigating away
  const isClientsList = location.pathname === "/clients";
  useEffect(() => {
    if (!isClientsList) clearQuery();
  }, [isClientsList, clearQuery]);

  const handleLogout = () => {
    setAnchor(null);
    logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const initials = getInitials(
    user?.name?.split(" ")[0],
    user?.name?.split(" ")[1],
  );
  const avatarColor = getAvatarColor(user?.id || user?.email || "user");

  return (
    <Box
      component="header"
      sx={{
        height: HEADER_HEIGHT,
        px: { xs: 2, md: 3 },
        backgroundColor: "background.paper",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={onOpenSidebar}
        sx={{ display: { xs: "inline-flex", md: "none" } }}
        aria-label="Abrir menú"
      >
        <MenuIcon size={20} />
      </IconButton>

      <TextField
        size="small"
        placeholder={
          isClientsList ? "Buscar clientes…" : "Buscar (disponible en Clientes)"
        }
        value={isClientsList ? query : ""}
        onChange={(e) => isClientsList && setQuery(e.target.value)}
        disabled={!isClientsList}
        sx={{
          width: { xs: "100%", sm: 360, md: 480 },
          maxWidth: "100%",
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  size={16}
                  color="#94A3B8"
                />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ flex: 1 }} />

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center" }}
      >
        <IconButton aria-label="Notificaciones">
          <Badge
            color="secondary"
            variant="dot"
          >
            <Bell size={18} />
          </Badge>
        </IconButton>

        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ p: 0.25 }}
          aria-label="Cuenta"
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor: avatarColor,
              color: "white",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {user?.name || "Usuario"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary" }}
            >
              {user?.email}
            </Typography>
          </Box>
          <Box sx={{ borderTop: "1px solid #E5E7EB" }} />
          <MenuItem
            onClick={handleLogout}
            sx={{ color: "error.main", gap: 1.25, py: 1.1 }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
}
