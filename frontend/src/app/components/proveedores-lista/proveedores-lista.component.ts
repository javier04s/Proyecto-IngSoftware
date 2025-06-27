import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proveedor-lista',
  templateUrl: './proveedores-lista.component.html',
  imports: [CommonModule, NgFor, NgIf, FormsModule]
})
export class ProveedorListaComponent implements OnInit, OnDestroy {
  proveedores: Proveedor[] = [];

  paginaActual: number = 1;
  elementosPorPagina: number = 8;

  mensaje: string = '';
  mostrarMensaje: boolean = false;
  tipoMensaje: 'exito' | 'error' = 'exito';

  proveedorAEliminarId: number | null = null;
  mostrarModalEliminar = false;
  mensajeErrorEliminar: string | null = null;

  proveedorAModificar: Proveedor | null = null;

  private proveedorService = inject(ProveedorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private usuarioSub?: Subscription;

  ngOnInit() {
    this.usuarioSub = this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.obtenerProveedores();
      } else {
        this.proveedores = [];
      }
    });
  }

  ngOnDestroy() {
    this.usuarioSub?.unsubscribe();
  }

  private obtenerProveedores(): void {
    this.proveedorService.ObtenerProveedoresLista().subscribe({
      next: (datos) => {
        this.proveedores = datos;
      },
      error: (error) => {
        console.error('Error al obtener la lista de proveedores', error);
      }
    });
  }

  proveedoresPaginados(): Proveedor[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return this.proveedores.slice(inicio, inicio + this.elementosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.proveedores.length / this.elementosPorPagina) || 1;
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  interfazAggProveedor(): void {
    this.router.navigate(['/proveedores/agregar']);
  }

  abrirDetalles(id: number): void {
    this.router.navigate(['/proveedores/detalle', id]);
  }

  abrirModalEliminar(id: number): void {
    this.proveedorAEliminarId = id;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar(): void {
    this.proveedorAEliminarId = null;
    this.mostrarModalEliminar = false;
    this.mensajeErrorEliminar = null;
  }

  confirmarEliminar(): void {
    if (this.proveedorAEliminarId != null) {
      this.proveedorService.eliminarProveedor(this.proveedorAEliminarId).subscribe({
        next: () => {
          this.obtenerProveedores();
          this.cancelarEliminar();
        },
        error: (err) => {
          if (err.status === 500) {
            this.mensajeErrorEliminar = 'No se puede eliminar el proveedor porque tiene productos asociados.';
          } else {
            this.mensajeErrorEliminar = 'Ocurrió un error al intentar eliminar el proveedor.';
          }
        }
      });
    }
  }

  iniciarModificar(proveedor: Proveedor): void {
    this.proveedorAModificar = { ...proveedor };
    this.mostrarModalEliminar = false;
  }

  cancelarModificar(): void {
    this.proveedorAModificar = null;
  }

  confirmarModificar(): void {
    if (this.proveedorAModificar) {
      this.proveedorService.actualizarProveedor(this.proveedorAModificar.id!, this.proveedorAModificar).subscribe({
        next: () => {
          this.obtenerProveedores();
          this.cancelarModificar();
          this.tipoMensaje = 'exito';
          this.mensaje = 'Proveedor modificado exitosamente.';
          this.mostrarMensaje = true;
          this.ocultarMensajeDespuesDeUnTiempo();
        },
        error: (err) => {
          console.error('Error al modificar proveedor:', err);
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
