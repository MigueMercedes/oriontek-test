import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  caption?: string;
  loading?: boolean;
}

export default function KpiCard({
  label,
  value,
  icon: Icon,
  caption,
  loading = false,
}: KpiCardProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.6875rem",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </Typography>
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
          }}
        >
          <Icon size={16} />
        </Box>
      </Stack>
      {loading ? (
        <Skeleton
          variant="text"
          width={80}
          height={36}
        />
      ) : (
        <Typography
          sx={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
      )}
      {caption && (
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", mt: 0.5, display: "block" }}
        >
          {caption}
        </Typography>
      )}
    </Paper>
  );
}
