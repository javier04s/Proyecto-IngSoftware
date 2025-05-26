export class PagoRequest {
  emailUsuario: string;
  monto: number;
  metodo: string;
  estado: string;
}

export class PagoResponse {
  id: number;
  emailUsuario: string;
  monto: number;
  metodo: string;
  estado: string;
  fechaPago: string;
}
