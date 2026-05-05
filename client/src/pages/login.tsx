import { Box, Paper, Stack, Typography } from "@mui/material";
import { Box as BoxIcon } from "lucide-react";
import { LoginForm } from "../features/auth/components/Form";

export default function Login() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
        backgroundColor: "background.default",
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 380,
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                backgroundColor: "secondary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BoxIcon size={20} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ lineHeight: 1, fontWeight: 700 }}
              >
                OrionTek
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", textTransform: "uppercase" }}
              >
                Enterprise CRM
              </Typography>
            </Box>
          </Stack>

          <Box>
            <Typography
              variant="h2"
              sx={{ mb: 0.5 }}
            >
              Bienvenido
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              Ingresa tus credenciales para acceder a tu cuenta.
            </Typography>
          </Box>

          <LoginForm />
        </Stack>
      </Paper>
    </Box>
  );
}
