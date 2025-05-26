// src/app/pagos/pagos-registrar/pagos-registrar.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagosService } from '../services/pagos.service'; // Asegúrate de la ruta correcta a tu servicio
import { PagoRequest, PagoResponse } from '../pagos'; // <--- ¡VERIFICA ESTA RUTA! (Asumo 'models/pago.model')
import { FormsModule } from '@angular/forms'; // Importado aquí porque es un componente standalone
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-registrar',
  templateUrl: './pagos-registrar.component.html', // Asegúrate de tener este archivo CSS o elimínalo si no lo usas
  imports: [FormsModule, CommonModule] // Importa FormsModule si es un componente standalone
})
export class PagosRegistrarComponent implements OnInit {

  pago: PagoRequest = {
    monto: 0,
    metodo: '', // Inicialización con cadena vacía, compatible con la solución HTML
    estado: ''  // Inicialización con cadena vacía, compatible con la solución HTML
  };
  pagoId: number | null = null;
  esEdicion: boolean = false;
  tituloFormulario: string = 'Registrar Nuevo Pago';

  // Define tus opciones para los select
  estados: string[] = ['PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'REEMBOLSADO'];
  metodos: string[] = ['TARJETA'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pagosService: PagosService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.pagoId = +idParam; // Convierte el string a number
        this.esEdicion = true;
        this.tituloFormulario = 'Modificar Pago';
        this.cargarPagoParaEdicion(this.pagoId);
      }
    });
  }

  cargarPagoParaEdicion(id: number): void {
    this.pagosService.obtenerPagoPorId(id).subscribe({ // Usando getUnPagoPorId del servicio
      next: (data: PagoResponse) => {
        this.pago = {
          monto: data.monto,
          metodo: data.metodo,
          estado: data.estado
        };
        console.log('Pago cargado para edición:', this.pago);
      },
      error: (error) => {
        console.error('Error al cargar el pago para edición:', error);
        alert('No se pudo cargar el pago para edición. Verifique la consola.');
        this.router.navigate(['/pagos']); // Redirigir a la lista si hay error
      }
    });
  }

  guardarPago(): void {
    if (this.esEdicion && this.pagoId !== null) {
      this.pagosService.actualizarPago(this.pagoId, this.pago).subscribe({
        next: (data) => {
          console.log('Pago actualizado con éxito:', data);
          alert('Pago actualizado con éxito.');
          this.router.navigate(['/pagos']); // Volver a la lista
        },
        error: (error) => {
          console.error('Error al actualizar el pago:', error);
          alert('Error al actualizar el pago. Verifique la consola.');
        }
      });
    } else {
      this.pagosService.agregarPago(this.pago).subscribe({
        next: (data) => {
          console.log('Pago registrado con éxito:', data);
          alert('Pago registrado con éxito.');
          this.router.navigate(['/pagos']); // Volver a la lista
        },
        error: (error) => {
          console.error('Error al registrar el pago:', error);
          alert('Error al registrar el pago. Verifique la consola.');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pagos']); // Volver a la lista de pagos
  }
}