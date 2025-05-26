import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoResponse, PagoRequest } from '../pagos';

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

}
