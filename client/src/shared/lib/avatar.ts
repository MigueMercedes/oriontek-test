// Deterministic avatar color so the same client always gets the same hue
// across renders and pages. We hash the id into one of a curated palette.
const PALETTE = [
  "#0051D5",
  "#7C3AED",
  "#0EA5E9",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#0F766E",
  "#DB2777",
  "#2563EB",
  "#9333EA",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(id: string): string {
  if (!id) return PALETTE[0];
  return PALETTE[hashString(id) % PALETTE.length];
}

export function getInitials(nombre?: string, apellido?: string): string {
  const a = (nombre || "").trim().charAt(0);
  const b = (apellido || "").trim().charAt(0);
  const initials = `${a}${b}`.toUpperCase();
  return initials || "?";
}
