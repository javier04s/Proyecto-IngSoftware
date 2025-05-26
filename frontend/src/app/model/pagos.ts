export interface PagoProductoRequest {
  productoId: number;
  cantidad: number;
}

export class PagoRequest {
  emailUsuario: string;
  monto: number;
  metodo: string;
  estado: string;
  productos: { productoId: number | null; cantidad: number }[];

}

export interface PagoProductoResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
}

export class PagoResponse {
  id: number;
  emailUsuario: string;
  monto: number;
  metodo: string;
  estado: string;
  fechaPago: string;
  productos?: PagoProductoResponse[];
}
