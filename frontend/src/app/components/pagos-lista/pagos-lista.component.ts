import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagosService } from '../../services/pagos.service';
import { PagoResponse } from '../../model/pagos';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pago-list',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, FormsModule],
  templateUrl: './pagos-lista.component.html'
})
export class PagosListaComponent implements OnInit {

  pagos: PagoResponse[] = [];

  estadoFiltro: string = '';
  montoFiltro: number | null = null;

  rolUsuario: string | null = null;
  emailUsuarioActual: string | null = null;

  pagosPorPagina: number = 8;
  paginaActual: number = 1;

  pagoAEliminarId: number | null = null;
  mostrarModalEliminar = false;

  constructor(
    private pagosService: PagosService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.rolUsuario = this.authService.getRol();
    this.emailUsuarioActual = this.authService.getEmailUsuario();

    this.cargarPagos();
  }

  cargarPagos(): void {
    this.pagosService.obtenerPagosLista().subscribe({
      next: (data) => {
        this.pagos = data;
        console.log('Pagos cargados con éxito:', this.pagos);
      },
      error: (error) => {
        console.error('Error al cargar los pagos:', error);
      }
    });
  }

  verDetalles(id: number): void {
    this.router.navigate(['/pagos', id]);
  }

  crearNuevoPago(): void {
    this.router.navigate(['/pagos/crear']);
  }

  pagosFiltrados(): PagoResponse[] {
    if (!this.rolUsuario) {
      return [];
    }

    let pagosFiltradosRol: PagoResponse[];

    if (this.rolUsuario === 'ADMINISTRADOR') {
      pagosFiltradosRol = this.pagos;
    } else if (this.rolUsuario === 'CLIENTE') {
      pagosFiltradosRol = this.pagos.filter(pago => pago.emailUsuario === this.emailUsuarioActual);
    } else {
      pagosFiltradosRol = [];
    }

    return pagosFiltradosRol.filter(pago => {
      const cumpleEstado = this.estadoFiltro === '' || pago.estado === this.estadoFiltro;
      const cumpleMonto = !this.montoFiltro || pago.monto >= this.montoFiltro;
      return cumpleEstado && cumpleMonto;
    });
  }

  pagosPaginados(): PagoResponse[] {
    const inicio = (this.paginaActual - 1) * this.pagosPorPagina;
    return this.pagosFiltrados().slice(inicio, inicio + this.pagosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.pagosFiltrados().length / this.pagosPorPagina);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetearFiltros(): void {
    this.estadoFiltro = '';
    this.montoFiltro = null;
    this.paginaActual = 1;
  }

  abrirModalEliminar(id: number): void {
    this.pagoAEliminarId = id;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminar(): void {
    this.pagoAEliminarId = null;
    this.mostrarModalEliminar = false;
  }

  confirmarEliminar(): void {
    if (this.pagoAEliminarId != null) {
      this.pagosService.eliminarPago(this.pagoAEliminarId).subscribe({
        next: () => {
          this.cargarPagos();
          this.cancelarEliminar();
        },
        error: (err) => {
          console.error('Error al eliminar pago:', err);
          this.cancelarEliminar();
        }
      });
    }
  }
}
