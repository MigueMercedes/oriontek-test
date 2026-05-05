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
import { useSnackbar } from "notistack";
import {
  useCliente,
  useUpdateCliente,
} from "../features/clientes/hooks";
import { ApiError } from "../shared/lib/apiError";
import ClienteForm from "../features/clientes/components/ClienteForm";

export default function ClientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: cliente, isLoading, error } = useCliente(id);
  const { mutate, isPending } = useUpdateCliente(id || "");

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
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate("/clients")}
            sx={{ mt: 1 }}
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
          height={48}
          sx={{ borderRadius: 1, mb: 2, width: 240 }}
        />
        <Skeleton
          variant="rectangular"
          height={300}
          sx={{ borderRadius: 1 }}
        />
      </Box>
    );
  }

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
        <MuiLink
          component={RouterLink}
          to={`/clients/${cliente.id}`}
          underline="hover"
          color="text.secondary"
        >
          {cliente.nombre} {cliente.apellido}
        </MuiLink>
        <Typography
          variant="body2"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          Editar
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h1"
        sx={{ mb: 0.5 }}
      >
        Editar cliente
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 3 }}
      >
        Actualiza la información de contacto y direcciones.
      </Typography>

      <ClienteForm
        mode="edit"
        defaultValues={cliente}
        isSubmitting={isPending}
        onSubmit={(payload, helpers) => {
          mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar("Cambios guardados", { variant: "success" });
              navigate(`/clients/${cliente.id}`);
            },
            onError: (err) => {
              if (err instanceof ApiError && err.status === 409) {
                helpers.setEmailError("Email ya registrado");
                return;
              }
              const message =
                err instanceof ApiError
                  ? err.message
                  : "No se pudo guardar";
              enqueueSnackbar(message, { variant: "error" });
            },
          });
        }}
      />
    </Box>
  );
}
