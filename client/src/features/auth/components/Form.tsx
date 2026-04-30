import { Box, Button, TextField, Typography } from "@mui/material";
import { LoaderIcon } from "lucide-react";
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

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
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
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
      />

      <Button type="submit" variant="contained" disabled={isPending}>
        {isPending ? <LoaderIcon size={16} /> : "Login"}
      </Button>

      {isError && (
        <Typography variant="body2" color="error" role="alert">
          {error.message}
        </Typography>
      )}
    </Box>
  );
}
