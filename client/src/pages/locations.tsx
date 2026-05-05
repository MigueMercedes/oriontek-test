import {
  Box,
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
import { MapPin } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useLocations } from "../features/direcciones/hooks";
import { formatRelative } from "../shared/lib/dates";

export default function Locations() {
  const { data, isLoading } = useLocations();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h1"
          sx={{ mb: 0.5 }}
        >
          Direcciones
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >
          Todas las direcciones registradas, agrupadas por cliente.
        </Typography>
      </Box>

      <Paper>
        {isLoading ? (
          <Box sx={{ p: 2.5 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={56}
                sx={{ mb: 1, borderRadius: 1 }}
              />
            ))}
          </Box>
        ) : !data || data.length === 0 ? (
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
              <MapPin size={22} />
            </Box>
            <Typography
              variant="h4"
              sx={{ mb: 0.5 }}
            >
              No hay direcciones aún
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              Las direcciones aparecerán aquí cuando registres clientes.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Calle</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Provincia</TableCell>
                  <TableCell>CP</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Creada</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((d) => (
                  <TableRow
                    key={d.id}
                    hover
                  >
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        <MapPin
                          size={14}
                          color="#94A3B8"
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "text.primary" }}
                        >
                          {d.calle}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{d.ciudad}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{d.provincia}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {d.codigoPostal || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <RouterLink
                        to={`/clients/${d.cliente.id}`}
                        style={{
                          color: "#0051D5",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {d.cliente.nombre} {d.cliente.apellido}
                      </RouterLink>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatRelative(d.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
