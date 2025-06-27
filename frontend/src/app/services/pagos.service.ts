import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoResponse, PagoRequest } from '../model/pagos';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private urlBase = 'http://localhost:8080/pagos';
  private clienteHttp = inject(HttpClient);

  obtenerPagosLista(): Observable<PagoResponse[]> {
    return this.clienteHttp.get<PagoResponse[]>(this.urlBase);
  }

  agregarPago(pago: PagoRequest): Observable<PagoResponse> {
    return this.clienteHttp.post<PagoResponse>(this.urlBase, pago);
  }

  obtenerPagoPorId(id: number): Observable<PagoResponse> {
    return this.clienteHttp.get<PagoResponse>(`${this.urlBase}/${id}`);
  }

  actualizarPago(id: number, pago: PagoRequest): Observable<PagoResponse> {
    return this.clienteHttp.put<PagoResponse>(`${this.urlBase}/${id}`, pago);
  }

  eliminarPago(id: number): Observable<void> {
    return this.clienteHttp.delete<void>(`${this.urlBase}/${id}`);
  }
}
