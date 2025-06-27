import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, ProductoCrearDTO } from '../model/producto';
import { Proveedor } from '../model/proveedor';

@Injectable({
  providedIn: 'root'
})

export class ProductoService {

  private urlBase = 'http://localhost:8080/productos';
  private clienteHttp = inject(HttpClient);

  obtenerProductosLista(): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(this.urlBase);
  }

  agregarProducto(producto: ProductoCrearDTO) {
    return this.clienteHttp.post<Producto>(this.urlBase, producto);
  }

  getProductoById(id: number) {
    return this.clienteHttp.get<Producto>(`http://localhost:8080/productos/${id}`);
  }

  actualizarProducto(id: number, producto: ProductoCrearDTO): Observable<Producto> {
    return this.clienteHttp.put<Producto>(`${this.urlBase}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.clienteHttp.delete<void>(`${this.urlBase}/${id}`);
  }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.clienteHttp.get<Proveedor[]>('http://localhost:8080/proveedores');
  }

  obtenerProductosPorProveedor(proveedorId: number): Observable<Producto[]> {
    return this.clienteHttp.get<Producto[]>(`http://localhost:8080/proveedores/detalle/${proveedorId}/productos`);
  }

}
