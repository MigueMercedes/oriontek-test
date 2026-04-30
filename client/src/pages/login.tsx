import { Box } from "@mui/material";
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
      }}
    >
      <LoginForm />
    </Box>
  );
}
