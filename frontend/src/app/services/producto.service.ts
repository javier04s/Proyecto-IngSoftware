import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto, ProductoCrearDTO } from '../producto';

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
    return this.clienteHttp.post<Producto>(`${this.urlBase}/productos`, producto);
  }

  getProductoById(id: number) {
    return this.clienteHttp.get<Producto>(`http://localhost:8080/productos/${id}`);
  }



}
