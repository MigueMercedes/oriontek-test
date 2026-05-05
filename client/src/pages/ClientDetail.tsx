import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link as MuiLink,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowLeft, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
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
import { getAvatarColor, getInitials } from "../shared/lib/avatar";
import { formatDateLong } from "../shared/lib/dates";

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

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center" }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                fontSize: "1.125rem",
                fontWeight: 700,
                backgroundColor: getAvatarColor(cliente.id),
              }}
            >
              {getInitials(cliente.nombre, cliente.apellido)}
            </Avatar>
            <Box>
              <Typography variant="h2">
                {cliente.nombre} {cliente.apellido}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                {cliente.email}
                {cliente.telefono ? ` · ${cliente.telefono}` : ""}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
              >
                Creado el {formatDateLong(cliente.createdAt)}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
          >
            <Button
              variant="outlined"
              startIcon={<Pencil size={15} />}
              onClick={() => navigate(`/clients/${cliente.id}/edit`)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash2 size={15} />}
              onClick={() => setConfirmOpen(true)}
              sx={{
                borderColor: "error.main",
                color: "error.main",
                "&:hover": {
                  borderColor: "error.dark",
                  backgroundColor: "rgba(220,38,38,0.04)",
                },
              }}
            >
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ mb: 1.5 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h3">Direcciones</Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              Lugares asociados a este cliente.
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              backgroundColor: "rgba(0,81,213,0.08)",
              px: 1.25,
              py: 0.5,
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            {cliente.direcciones.length} en total
          </Typography>
        </Stack>
      </Box>

      {cliente.direcciones.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
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
            <MapPin size={22} />
          </Box>
          <Typography
            variant="h4"
            sx={{ mb: 0.5 }}
          >
            Sin direcciones registradas
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Este cliente no tiene direcciones registradas.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Plus size={16} />}
            onClick={() => navigate(`/clients/${cliente.id}/edit`)}
          >
            Editar para agregar
          </Button>
        </Paper>
      ) : (
        <Grid
          container
          spacing={2}
        >
          {cliente.direcciones.map((d) => (
            <Grid
              key={d.id}
              size={{ xs: 12, sm: 6, lg: 4 }}
            >
              <Paper sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: "rgba(0,81,213,0.08)",
                      color: "secondary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={16} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {d.calle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {d.ciudad}, {d.provincia}
                      {d.codigoPostal ? ` · ${d.codigoPostal}` : ""}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

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
