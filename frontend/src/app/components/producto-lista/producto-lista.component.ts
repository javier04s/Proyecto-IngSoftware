import { Component, inject, OnInit } from '@angular/core';
import { Producto, ProductoCrearDTO } from '../../model/producto';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { NgFor, AsyncPipe, NgIf, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Proveedor } from '../../model/proveedor';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  standalone: true,
  imports: [FormsModule, NgFor, AsyncPipe, NgIf, CommonModule]
})
export class ProductoListaComponent implements OnInit {
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];

  filtroMarca: string = '';
  filtroPrecioMax: number | null = null;
  filtroCantidadMin: number | null = null;

  mensaje: string = '';
  mostrarMensaje: boolean = false;
  tipoMensaje: 'exito' | 'error' = 'exito';

  usuario$: Observable<Usuario | null>;
  proveedorIdSeleccionado: number | null = null;

  paginaActual: number = 1;
  elementosPorPagina: number = 8;

  productoAEliminarId: number | null = null;
  mostrarModalEliminar = false;

  productoAModificar: Producto | null = null;
  mostrarModalModificar = false;

  private productoServicio = inject(ProductoService);
  private usuarioServicio = inject(UsuarioService);
  private proveedorServicio = inject(ProductoService);

  constructor(private router: Router) {
    this.usuario$ = this.usuarioServicio.usuario$;
  }

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerProveedores();
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

  obtenerProveedores(): void {
    this.proveedorServicio.obtenerProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: (err) => console.error('Error al obtener proveedores', err)
    });
  }

  get productosFiltrados(): Producto[] {
    return this.productos?.filter(p =>
      (!this.filtroMarca || p.marca.toLowerCase().includes(this.filtroMarca.toLowerCase())) &&
      (!this.filtroPrecioMax || p.precio <= this.filtroPrecioMax) &&
      (!this.filtroCantidadMin || p.cantidad >= this.filtroCantidadMin)
    ) || [];
  }

  get productosPaginaActual(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.elementosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.elementosPorPagina) || 1;
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  abrirDetalles(id: number): void {
    this.router.navigate(['/productos', id]);
  }

  interfazAggProducto(): void {
    this.router.navigate(['/productos/nuevos']);
  }

  resetearFiltros(): void {
    this.filtroMarca = '';
    this.filtroPrecioMax = null;
    this.filtroCantidadMin = null;
  }

  abrirModalEliminar(id: number): void {
    this.productoAEliminarId = id;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar(): void {
    this.productoAEliminarId = null;
    this.mostrarModalEliminar = false;
  }

  confirmarEliminar(): void {
    if (this.productoAEliminarId != null) {
      this.productoServicio.eliminarProducto(this.productoAEliminarId).subscribe({
        next: () => {
          this.obtenerProductos();
          this.cancelarEliminar();
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          this.cancelarEliminar();
        }
      });
    }
  }

  iniciarModificar(producto: Producto): void {
    this.productoAModificar = { ...producto };
    this.proveedorIdSeleccionado = producto.proveedor?.id ?? null;
  }

  cancelarModificar(): void {
    this.productoAModificar = null;
  }

  confirmarModificar(): void {
    if (this.productoAModificar) {
      const productoActualizar: ProductoCrearDTO = {
        nombre: this.productoAModificar.nombre,
        descripcion: this.productoAModificar.descripcion,
        precio: this.productoAModificar.precio,
        cantidad: this.productoAModificar.cantidad,
        proveedorId: this.proveedorIdSeleccionado ?? 0,
        creadoPorId: 1,
        marca: this.productoAModificar.marca
      };

      this.productoServicio.actualizarProducto(this.productoAModificar.id!, productoActualizar).subscribe({
        next: () => {
          this.obtenerProductos();
          this.cancelarModificar();
          this.tipoMensaje = 'exito';
          this.mensaje = 'Producto modificado exitosamente.';
          this.mostrarMensaje = true;
          this.ocultarMensajeDespuesDeUnTiempo();
        },
        error: (err) => {
          console.error('Error al modificar producto:', err);
          this.cancelarModificar();
          this.tipoMensaje = 'error';
          this.mensaje = 'Error al modificar el producto. Intente nuevamente.';
          this.mostrarMensaje = true;
          this.ocultarMensajeDespuesDeUnTiempo();
        }
      });
    }
  }

  ocultarMensajeDespuesDeUnTiempo(): void {
    setTimeout(() => {
      this.mostrarMensaje = false;
    }, 4000);
  }


}
