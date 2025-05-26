export class Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  localizacion: string;
  especializacion: string;
  plazoEntrega: string;
  fechaCreacion: string;
}

export interface ProveedorCrearDTO{
  nombre: string;
  telefono: string;
  email: string;
  localizacion: string;
  especializacion: string;
  plazoEntrega: string;
  fechaCreacion: string;
  id: number;
}