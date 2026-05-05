import {
  Avatar,
  Box,
  Button,
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
import { Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAvatarColor, getInitials } from "../../../shared/lib/avatar";
import { formatRelative } from "../../../shared/lib/dates";
import type { DashboardRecentClient } from "../types";

interface RecentClientesTableProps {
  clientes: DashboardRecentClient[];
  loading?: boolean;
  hasClientes: boolean;
}

export default function RecentClientesTable({
  clientes,
  loading = false,
  hasClientes,
}: RecentClientesTableProps) {
  const navigate = useNavigate();

  return (
    <Paper>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2.5,
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h3">Clientes recientes</Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            Últimos clientes agregados al sistema.
          </Typography>
        </Box>
        {hasClientes && (
          <Button
            variant="text"
            onClick={() => navigate("/clients")}
          >
            Ver todos
          </Button>
        )}
      </Stack>

      {loading ? (
        <Box sx={{ p: 2.5, pt: 0 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={56}
              sx={{ mb: 1, borderRadius: 1 }}
            />
          ))}
        </Box>
      ) : !hasClientes ? (
        <Box
          sx={{
            p: 5,
            textAlign: "center",
            borderTop: "1px solid #E5E7EB",
          }}
        >
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
            Comienza agregando tu primer cliente al sistema.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Plus size={16} />}
            onClick={() => navigate("/clients/new")}
          >
            Crear primer cliente
          </Button>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Direcciones</TableCell>
                <TableCell>Creado</TableCell>
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
                          width: 32,
                          height: 32,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor: getAvatarColor(c.id),
                        }}
                      >
                        {getInitials(c.nombre, c.apellido)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {c.nombre} {c.apellido}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{c.email}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {c._count.direcciones}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {formatRelative(c.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
