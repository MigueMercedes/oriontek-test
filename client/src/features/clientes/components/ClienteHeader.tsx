import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { getAvatarColor, getInitials } from "../../../shared/lib/avatar";
import { formatDateLong } from "../../../shared/lib/dates";
import type { ClienteDetail } from "../types";

interface ClienteHeaderProps {
  cliente: ClienteDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ClienteHeader({
  cliente,
  onEdit,
  onDelete,
}: ClienteHeaderProps) {
  return (
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
            onClick={onEdit}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={15} />}
            onClick={onDelete}
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
  );
}
