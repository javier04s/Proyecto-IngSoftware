import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../model/proveedor';
import { Producto } from '../model/producto';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private urlBase = 'http://localhost:8080/proveedores';
  private clienteHttp = inject(HttpClient);

  ObtenerProveedoresLista(): Observable<Proveedor[]> {
    return this.clienteHttp.get<Proveedor[]>(this.urlBase);
  }

  AgregarProveedor(proveedor: Proveedor) {
    return this.clienteHttp.post(this.urlBase, proveedor);
  }

  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    const url = `${this.urlBase}/${id}`;
    return this.clienteHttp.get<Proveedor>(url);
  }

  constructor() { }
}
