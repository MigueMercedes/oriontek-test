import {
  Box,
  Breadcrumbs,
  Button,
  Link as MuiLink,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import {
  Link as RouterLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "notistack";
import {
  useCliente,
  useDeleteCliente,
} from "../features/clientes/hooks";
import { ApiError } from "../shared/lib/apiError";
import ConfirmDialog from "../shared/components/ConfirmDialog";
import ClienteHeader from "../features/clientes/components/ClienteHeader";
import DireccionesGrid from "../features/clientes/components/DireccionesGrid";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: cliente, isLoading, error } = useCliente(id);
  const { mutate: deleteCliente, isPending: isDeleting } = useDeleteCliente();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (error instanceof ApiError && error.status === 404) {
    return (
      <Box>
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{ mb: 1 }}
          >
            Cliente no encontrado
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            El cliente que buscas no existe o fue eliminado.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/clients")}
          >
            Volver a clientes
          </Button>
        </Paper>
      </Box>
    );
  }

  if (isLoading || !cliente) {
    return (
      <Box>
        <Skeleton
          variant="rectangular"
          height={120}
          sx={{ borderRadius: 1, mb: 2 }}
        />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    );
  }

  const onConfirmDelete = () => {
    deleteCliente(cliente.id, {
      onSuccess: () => {
        enqueueSnackbar("Cliente eliminado", { variant: "success" });
        navigate("/clients");
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
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <MuiLink
          component={RouterLink}
          to="/clients"
          underline="hover"
          color="text.secondary"
        >
          Clientes
        </MuiLink>
        <Typography
          variant="body2"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          {cliente.nombre} {cliente.apellido}
        </Typography>
      </Breadcrumbs>

      <ClienteHeader
        cliente={cliente}
        onEdit={() => navigate(`/clients/${cliente.id}/edit`)}
        onDelete={() => setConfirmOpen(true)}
      />

      <DireccionesGrid
        direcciones={cliente.direcciones}
        onAddRequest={() => navigate(`/clients/${cliente.id}/edit`)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar cliente?"
        description={`Esta acción eliminará a ${cliente.nombre} ${cliente.apellido} y todas sus direcciones. No se puede deshacer.`}
        confirmLabel="Eliminar"
        destructive
        loading={isDeleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
      />
    </Box>
  );
}
