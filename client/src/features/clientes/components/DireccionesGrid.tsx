import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { MapPin, Plus } from "lucide-react";
import type { Direccion } from "../types";

interface DireccionesGridProps {
  direcciones: Direccion[];
  onAddRequest: () => void;
}

export default function DireccionesGrid({
  direcciones,
  onAddRequest,
}: DireccionesGridProps) {
  return (
    <>
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
            {direcciones.length} en total
          </Typography>
        </Stack>
      </Box>

      {direcciones.length === 0 ? (
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
            onClick={onAddRequest}
          >
            Editar para agregar
          </Button>
        </Paper>
      ) : (
        <Grid
          container
          spacing={2}
        >
          {direcciones.map((d) => (
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
    </>
  );
}
