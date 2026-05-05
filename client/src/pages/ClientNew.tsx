import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ClienteForm from "../features/clientes/components/ClienteForm";
import { useCreateCliente } from "../features/clientes/hooks";
import { ApiError } from "../shared/lib/apiError";

export default function ClientNew() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isPending } = useCreateCliente();

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
          Nuevo
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h1"
        sx={{ mb: 0.5 }}
      >
        Nuevo cliente
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 3 }}
      >
        Completa los datos y registra al menos una dirección.
      </Typography>

      <ClienteForm
        mode="create"
        isSubmitting={isPending}
        onSubmit={(payload, helpers) => {
          mutate(payload, {
            onSuccess: () => {
              enqueueSnackbar("Cliente creado", { variant: "success" });
              navigate("/clients");
            },
            onError: (err) => {
              if (err instanceof ApiError && err.status === 409) {
                helpers.setEmailError("Email ya registrado");
                return;
              }
              const message =
                err instanceof ApiError
                  ? err.message
                  : "No se pudo crear el cliente";
              enqueueSnackbar(message, { variant: "error" });
            },
          });
        }}
      />
    </Box>
  );
}
