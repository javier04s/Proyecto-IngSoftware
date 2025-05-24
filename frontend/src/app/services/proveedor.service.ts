import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private urlBase = 'http://localhost:8080/proveedores';
  private clienteHttp = inject(HttpClient);

  ObtenerProveedoresLista(): Observable<Proveedor[]> {
    return this.clienteHttp.get<Proveedor[]>(this.urlBase);
  }

  crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.clienteHttp.post<Proveedor>(`${this.urlBase}`, proveedor);
  }

  constructor() { }
}