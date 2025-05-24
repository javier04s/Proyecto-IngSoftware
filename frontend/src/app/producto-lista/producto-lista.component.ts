import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { ProductoService } from '../services/producto.service';
import { UsuarioService, Usuario } from '../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  standalone: true,
  imports: [FormsModule, NgFor, AsyncPipe, NgIf]
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];

  filtroMarca: string = '';
  filtroPrecioMax: number | null = null;
  filtroCantidadMin: number | null = null;

  usuario$: Observable<Usuario | null>;

  private productoServicio = inject(ProductoService);
  private usuarioServicio = inject(UsuarioService);

  constructor(private router: Router) {
    this.usuario$ = this.usuarioServicio.usuario$;
  }

  ngOnInit() {
    this.obtenerProductos();
  }

  private obtenerProductos(): void {
    this.productoServicio.obtenerProductosLista().subscribe({
      next: (datos) => {
        this.productos = datos;
      },
      error: (error) => {
        console.error('Error al obtener la lista de productos', error);
      }
    });
  }

  get productosFiltrados(): Producto[] {
    return this.productos?.filter(p =>
      (!this.filtroMarca || p.marca.toLowerCase().includes(this.filtroMarca.toLowerCase())) &&
      (!this.filtroPrecioMax || p.precio <= this.filtroPrecioMax) &&
      (!this.filtroCantidadMin || p.cantidad >= this.filtroCantidadMin)
    ) || [];
  }

  abrirDetalles(id: number): void {
    this.router.navigate(['/productos', id]);
  }

}
