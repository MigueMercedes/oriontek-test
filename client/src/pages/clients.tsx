import {
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Filter, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import ClientesKpis from "../features/clientes/components/ClientesKpis";
import ClientesTable from "../features/clientes/components/ClientesTable";
import FiltersPopover from "../features/clientes/components/FiltersPopover";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  type ClientesFilters,
} from "../features/clientes/components/filters";
import {
  useClientes,
  useDeleteCliente,
} from "../features/clientes/hooks";
import { useDashboardStats } from "../features/dashboard/hooks";
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
  const [filtersAnchor, setFiltersAnchor] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<ClientesFilters>(DEFAULT_FILTERS);

  const activeFiltersCount = countActiveFilters(filters);

  const filtered = useMemo(() => {
    if (!clientes) return [];
    const q = query.trim().toLowerCase();

    let list = q
      ? clientes.filter((c) =>
          [c.nombre, c.apellido, c.email, c.telefono ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : clientes;

    if (filters.direcciones !== "all") {
      list = list.filter((c) => {
        const count = c._count?.direcciones ?? 0;
        if (filters.direcciones === "none") return count === 0;
        if (filters.direcciones === "one") return count === 1;
        return count >= 2;
      });
    }

    const sorted = [...list];
    if (filters.sortBy === "oldest") {
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (filters.sortBy === "alpha") {
      sorted.sort((a, b) =>
        `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`),
      );
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return sorted;
  }, [clientes, query, filters]);

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
          <Badge
            badgeContent={activeFiltersCount}
            color="secondary"
            overlap="rectangular"
            slotProps={{
              badge: {
                sx: { top: 6, right: 6, height: 18, minWidth: 18, fontSize: 10 },
              },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Filter size={16} />}
              onClick={(e) => setFiltersAnchor(e.currentTarget)}
            >
              Filtros
            </Button>
          </Badge>
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

      <ClientesKpis
        clientes={clientes}
        nuevosUltimaSemana={stats?.nuevosUltimaSemana ?? 0}
        loading={isLoading}
      />

      <ClientesTable
        clientes={filtered}
        loading={isLoading}
        hasAnyCliente={(clientes?.length ?? 0) > 0}
        onMenuOpen={openMenu}
      />

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

      <FiltersPopover
        anchorEl={filtersAnchor}
        open={Boolean(filtersAnchor)}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFiltersAnchor(null)}
      />

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
