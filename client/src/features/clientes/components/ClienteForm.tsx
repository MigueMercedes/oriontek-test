import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import type { ClienteDetail, ClientePayload } from "../types";

const direccionSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  calle: z.string().trim().min(1, "Calle requerida"),
  ciudad: z.string().trim().min(1, "Ciudad requerida"),
  provincia: z.string().trim().min(1, "Provincia requerida"),
  codigoPostal: z
    .string()
    .trim()
    .max(20, "Máximo 20 caracteres")
    .optional()
    .or(z.literal("")),
});

const schema = z.object({
  nombre: z.string().trim().min(1, "Nombre requerido"),
  apellido: z.string().trim().min(1, "Apellido requerido"),
  email: z.string().trim().email("Email inválido"),
  telefono: z
    .string()
    .trim()
    .max(40, "Máximo 40 caracteres")
    .optional()
    .or(z.literal("")),
  direcciones: z
    .array(direccionSchema)
    .min(1, "Agrega al menos una dirección"),
});

type FormValues = z.infer<typeof schema>;

interface ClienteFormProps {
  mode: "create" | "edit";
  defaultValues?: ClienteDetail;
  isSubmitting?: boolean;
  onSubmit: (
    payload: ClientePayload,
    helpers: {
      setEmailError: (msg: string) => void;
    },
  ) => void | Promise<void>;
}

const EMPTY_DIRECCION = {
  calle: "",
  ciudad: "",
  provincia: "",
  codigoPostal: "",
};

export default function ClienteForm({
  mode,
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: ClienteFormProps) {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          nombre: defaultValues.nombre,
          apellido: defaultValues.apellido,
          email: defaultValues.email,
          telefono: defaultValues.telefono ?? "",
          direcciones:
            defaultValues.direcciones.length > 0
              ? defaultValues.direcciones.map((d) => ({
                  id: d.id,
                  calle: d.calle,
                  ciudad: d.ciudad,
                  provincia: d.provincia,
                  codigoPostal: d.codigoPostal ?? "",
                }))
              : [EMPTY_DIRECCION],
        }
      : {
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          direcciones: [EMPTY_DIRECCION],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "direcciones",
  });

  const submit = handleSubmit((values) => {
    const payload: ClientePayload = {
      nombre: values.nombre.trim(),
      apellido: values.apellido.trim(),
      email: values.email.trim(),
      telefono: values.telefono?.trim() || undefined,
      direcciones: values.direcciones.map((d) => ({
        ...(d.id ? { id: d.id } : {}),
        calle: d.calle.trim(),
        ciudad: d.ciudad.trim(),
        provincia: d.provincia.trim(),
        codigoPostal: d.codigoPostal?.trim() || undefined,
      })),
    };

    return onSubmit(payload, {
      setEmailError: (msg) =>
        setError("email", { type: "server", message: msg }),
    });
  });

  return (
    <Box
      component="form"
      onSubmit={submit}
      noValidate
    >
      <Stack spacing={3}>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h3"
            sx={{ mb: 0.5 }}
          >
            Información del cliente
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 2.5 }}
          >
            Datos de contacto principales.
          </Typography>

          <Grid
            container
            spacing={2}
          >
            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <TextField
                label="Nombre"
                fullWidth
                size="small"
                {...register("nombre")}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre?.message}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <TextField
                label="Apellido"
                fullWidth
                size="small"
                {...register("apellido")}
                error={Boolean(errors.apellido)}
                helperText={errors.apellido?.message}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                {...register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
            >
              <TextField
                label="Teléfono"
                fullWidth
                size="small"
                {...register("telefono")}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono?.message}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 2.5,
            }}
          >
            <Box>
              <Typography variant="h3">Direcciones</Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                Cada cliente debe tener al menos una dirección.
              </Typography>
            </Box>
            <Button
              startIcon={<Plus size={16} />}
              variant="outlined"
              onClick={() => append(EMPTY_DIRECCION)}
            >
              Agregar dirección
            </Button>
          </Stack>

          {errors.direcciones?.message && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 2 }}
            >
              {errors.direcciones.message}
            </Typography>
          )}

          <Stack spacing={2}>
            {fields.map((field, index) => {
              const dirErrors = errors.direcciones?.[index];
              return (
                <Box
                  key={field.id}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#FAFBFC",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <MapPin
                        size={16}
                        color="#0051D5"
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600 }}
                      >
                        Dirección {index + 1}
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      aria-label="Eliminar dirección"
                      sx={{ color: "error.main" }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Stack>

                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      size={{ xs: 12 }}
                    >
                      <TextField
                        label="Calle"
                        fullWidth
                        size="small"
                        {...register(`direcciones.${index}.calle` as const)}
                        error={Boolean(dirErrors?.calle)}
                        helperText={dirErrors?.calle?.message}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                    >
                      <TextField
                        label="Ciudad"
                        fullWidth
                        size="small"
                        {...register(`direcciones.${index}.ciudad` as const)}
                        error={Boolean(dirErrors?.ciudad)}
                        helperText={dirErrors?.ciudad?.message}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                    >
                      <TextField
                        label="Provincia"
                        fullWidth
                        size="small"
                        {...register(`direcciones.${index}.provincia` as const)}
                        error={Boolean(dirErrors?.provincia)}
                        helperText={dirErrors?.provincia?.message}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                    >
                      <TextField
                        label="Código Postal"
                        fullWidth
                        size="small"
                        {...register(
                          `direcciones.${index}.codigoPostal` as const,
                        )}
                        error={Boolean(dirErrors?.codigoPostal)}
                        helperText={dirErrors?.codigoPostal?.message}
                      />
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Stack>
        </Paper>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress
                  size={14}
                  sx={{ color: "white" }}
                />
              ) : null
            }
          >
            {mode === "create" ? "Crear cliente" : "Guardar cambios"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
