import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
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
import {
  BarChart3,
  Filter,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import KpiCard from "../shared/components/KpiCard";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import {
  useClientes,
  useDeleteCliente,
} from "../features/clientes/hooks";
import { useDashboardStats } from "../features/dashboard/hooks";
import { getAvatarColor, getInitials } from "../shared/lib/avatar";
import type { ClienteListItem } from "../features/clientes/types";
import { useSearchStore } from "../shared/state/searchStore";
import { ApiError } from "../shared/lib/apiError";

export default function Clients() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useSearchStore((s) => s.query);

  const { data: clientes, isLoading } = useClientes();
  const { data: stats } = useDashboardStats();
  const { mutate: deleteCliente, isPending: isDeleting } = useDeleteCliente();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeCliente, setActiveCliente] = useState<ClienteListItem | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!clientes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((c) =>
      [c.nombre, c.apellido, c.email, c.telefono ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [clientes, query]);

  const totalClientes = clientes?.length ?? 0;
  const totalDirecciones =
    clientes?.reduce((acc, c) => acc + (c._count?.direcciones ?? 0), 0) ?? 0;
  const promedio =
    totalClientes > 0
      ? (totalDirecciones / totalClientes).toFixed(1)
      : "0.0";

  const openMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    cliente: ClienteListItem,
  ) => {
    event.stopPropagation();
    setActiveCliente(cliente);
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => setMenuAnchor(null);

  const onView = () => {
    if (activeCliente) navigate(`/clients/${activeCliente.id}`);
    closeMenu();
  };
  const onEdit = () => {
    if (activeCliente) navigate(`/clients/${activeCliente.id}/edit`);
    closeMenu();
  };
  const onAskDelete = () => {
    setConfirmOpen(true);
    closeMenu();
  };

  const onConfirmDelete = () => {
    if (!activeCliente) return;
    deleteCliente(activeCliente.id, {
      onSuccess: () => {
        enqueueSnackbar("Cliente eliminado", { variant: "success" });
        setConfirmOpen(false);
        setActiveCliente(null);
      },
      onError: (err) => {
        const message =
          err instanceof ApiError ? err.message : "No se pudo eliminar";
        enqueueSnackbar(message, { variant: "error" });
      },
    });
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ mb: 0.5 }}
          >
            Directorio de clientes
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            Gestiona tus relaciones empresariales y libretas de direcciones.
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1.5}
        >
          <Button
            variant="outlined"
            startIcon={<Filter size={16} />}
            onClick={() => enqueueSnackbar("Filtros: próximamente", { variant: "info" })}
          >
            Filtros
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Plus size={16} />}
            onClick={() => navigate("/clients/new")}
          >
            Nuevo cliente
          </Button>
        </Stack>
      </Stack>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Total clientes"
            value={totalClientes}
            icon={Users}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Total direcciones"
            value={totalDirecciones}
            icon={MapPin}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Direcciones / cliente"
            value={promedio}
            icon={BarChart3}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Nuevos esta semana"
            value={stats?.nuevosUltimaSemana ?? 0}
            icon={TrendingUp}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      <Paper>
        {isLoading ? (
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
        ) : totalClientes === 0 ? (
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
        ) : filtered.length === 0 ? (
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
        ) : (
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
                {filtered.map((c) => (
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
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "text.primary" }}
                          >
                            {c.nombre} {c.apellido}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {c.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {c.telefono || "—"}
                      </Typography>
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
                        onClick={(e) => openMenu(e, c)}
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
        )}
      </Paper>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 160 } } }}
      >
        <MenuItem
          onClick={onView}
          sx={{ gap: 1.25 }}
        >
          <Users size={15} />
          Ver detalle
        </MenuItem>
        <MenuItem
          onClick={onEdit}
          sx={{ gap: 1.25 }}
        >
          <Pencil size={15} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={onAskDelete}
          sx={{ gap: 1.25, color: "error.main" }}
        >
          <Trash2 size={15} />
          Eliminar
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar cliente?"
        description={
          activeCliente
            ? `Esta acción eliminará a ${activeCliente.nombre} ${activeCliente.apellido} y todas sus direcciones. No se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar"
        destructive
        loading={isDeleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  );
}
