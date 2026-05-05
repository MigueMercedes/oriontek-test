import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { type FormEvent, useState } from "react";
import { useLogin } from "../hooks";

export function LoginForm() {
  const { mutate, isPending, isError, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ email, password });
  };

  const errorMessage =
    error?.status === 401
      ? "Credenciales incorrectas"
      : error?.message || "No se pudo iniciar sesión";

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <TextField
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        size="small"
      />

      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        size="small"
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={isPending}
        sx={{ height: 40 }}
      >
        {isPending ? (
          <CircularProgress
            size={18}
            sx={{ color: "white" }}
          />
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      {isError && (
        <Alert
          severity="error"
          variant="outlined"
        >
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
}
