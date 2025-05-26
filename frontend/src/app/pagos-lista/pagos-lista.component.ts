import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagosService } from '../services/pagos.service' 
import { PagoResponse } from '../pagos';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-pago-list',
  templateUrl: './pagos-lista.component.html',
  imports: [NgIf, NgFor, CommonModule]
})
export class PagosListaComponent implements OnInit {

  pagos: PagoResponse[] = [];

  constructor(
    private pagosService: PagosService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    console.log('Ver detalles del pago con ID:', id);
    this.router.navigate(['/pagos', id]);
  }

  crearNuevoPago(): void {
    this.router.navigate(['/pagos/crear']);
  }
}