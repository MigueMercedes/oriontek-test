export interface DireccionListItem {
  id: string;
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string | null;
  createdAt: string;
  cliente: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
}
