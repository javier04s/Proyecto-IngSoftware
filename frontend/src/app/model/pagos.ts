// src/app/model/pagos.ts

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
  // Nuevos campos para la tarjeta de crédito (marcados como opcionales)
  numeroTarjeta?: string;
  fechaExpiracion?: string;
  cvv?: string;
  nombreTitular?: string;
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
  // Nuevos campos para la tarjeta de crédito (marcados como opcionales)
  numeroTarjeta?: string;
  fechaExpiracion?: string;
  cvv?: string;
  nombreTitular?: string;
}