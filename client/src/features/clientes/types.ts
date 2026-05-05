export interface Direccion {
  id: string;
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string | null;
}

export interface ClienteListItem {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  createdAt: string;
  _count: {
    direcciones: number;
  };
}

export interface ClienteDetail {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string | null;
  createdAt: string;
  direcciones: Direccion[];
}

export interface DireccionPayload {
  id?: string | number;
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
}

export interface ClientePayload {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direcciones: DireccionPayload[];
}
