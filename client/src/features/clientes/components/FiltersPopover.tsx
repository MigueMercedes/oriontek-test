import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  type ClientesFilters,
  type DireccionesFilter,
  type SortBy,
} from "./filters";

interface FiltersPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  filters: ClientesFilters;
  onChange: (next: ClientesFilters) => void;
  onClose: () => void;
}

const radioSx = {
  ml: 0,
  mr: 0,
  py: 0.25,
  "& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
};

export default function FiltersPopover({
  anchorEl,
  open,
  filters,
  onChange,
  onClose,
}: FiltersPopoverProps) {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{ paper: { sx: { width: 280, p: 2.25, mt: 0.5 } } }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 600,
              color: "text.secondary",
              fontSize: "0.6875rem",
            }}
          >
            Direcciones
          </Typography>
          <RadioGroup
            value={filters.direcciones}
            onChange={(_, value) =>
              onChange({ ...filters, direcciones: value as DireccionesFilter })
            }
            sx={{ mt: 0.5 }}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="Todos"
              sx={radioSx}
            />
            <FormControlLabel
              value="none"
              control={<Radio size="small" />}
              label="Sin direcciones"
              sx={radioSx}
            />
            <FormControlLabel
              value="one"
              control={<Radio size="small" />}
              label="Con 1 dirección"
              sx={radioSx}
            />
            <FormControlLabel
              value="multi"
              control={<Radio size="small" />}
              label="Con 2 o más"
              sx={radioSx}
            />
          </RadioGroup>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="caption"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 600,
              color: "text.secondary",
              fontSize: "0.6875rem",
            }}
          >
            Ordenar por
          </Typography>
          <RadioGroup
            value={filters.sortBy}
            onChange={(_, value) =>
              onChange({ ...filters, sortBy: value as SortBy })
            }
            sx={{ mt: 0.5 }}
          >
            <FormControlLabel
              value="recent"
              control={<Radio size="small" />}
              label="Más recientes"
              sx={radioSx}
            />
            <FormControlLabel
              value="oldest"
              control={<Radio size="small" />}
              label="Más antiguos"
              sx={radioSx}
            />
            <FormControlLabel
              value="alpha"
              control={<Radio size="small" />}
              label="Alfabético (A-Z)"
              sx={radioSx}
            />
          </RadioGroup>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", pt: 0.5 }}
        >
          <Button
            size="small"
            onClick={() => onChange(DEFAULT_FILTERS)}
            disabled={countActiveFilters(filters) === 0}
          >
            Limpiar
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={onClose}
          >
            Listo
          </Button>
        </Stack>
      </Stack>
    </Popover>
  );
}
