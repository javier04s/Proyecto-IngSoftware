import { Proveedor } from './proveedor';

export class Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  marca: string;
  fechaCreacion: Date;
  proveedor?: Proveedor;
}

export interface ProductoCrearDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  marca: string;
  proveedorId: number;
  creadoPorId: number;
}

