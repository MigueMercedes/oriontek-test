import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { MoreVertical, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAvatarColor, getInitials } from "../../../shared/lib/avatar";
import type { ClienteListItem } from "../types";

interface ClientesTableProps {
  clientes: ClienteListItem[];
  loading?: boolean;
  hasAnyCliente: boolean;
  onMenuOpen: (
    event: React.MouseEvent<HTMLButtonElement>,
    cliente: ClienteListItem,
  ) => void;
}

export default function ClientesTable({
  clientes,
  loading = false,
  hasAnyCliente,
  onMenuOpen,
}: ClientesTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Paper>
        <Box sx={{ p: 2.5 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={56}
              sx={{ mb: 1, borderRadius: 1 }}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  if (!hasAnyCliente) {
    return (
      <Paper>
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "rgba(0,81,213,0.08)",
              color: "secondary.main",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <UserPlus size={22} />
          </Box>
          <Typography
            variant="h4"
            sx={{ mb: 0.5 }}
          >
            No hay clientes aún
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Crea el primer cliente para comenzar.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Plus size={16} />}
            onClick={() => navigate("/clients/new")}
          >
            Nuevo cliente
          </Button>
        </Box>
      </Paper>
    );
  }

  if (clientes.length === 0) {
    return (
      <Paper>
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ mb: 0.5 }}
          >
            Sin resultados
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            No encontramos clientes que coincidan con tu búsqueda.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell align="right">Direcciones</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((c) => (
              <TableRow
                key={c.id}
                hover
                onClick={() => navigate(`/clients/${c.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1.25}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        backgroundColor: getAvatarColor(c.id),
                      }}
                    >
                      {getInitials(c.nombre, c.apellido)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {c.nombre} {c.apellido}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", overflowWrap: "anywhere" }}
                      >
                        {c.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{c.telefono || "—"}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    {c._count?.direcciones ?? 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => onMenuOpen(e, c)}
                    aria-label="Acciones"
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
