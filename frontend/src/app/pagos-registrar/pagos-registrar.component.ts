import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagosService } from '../services/pagos.service';
import { PagoRequest, PagoResponse } from '../pagos';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-registrar',
  templateUrl: './pagos-registrar.component.html',
  imports: [FormsModule, CommonModule]
})
export class PagosRegistrarComponent implements OnInit {

  pago: PagoRequest = {
    monto: 0,
    metodo: '',
    estado: '',
    emailUsuario: ''
  };
  pagoId: number | null = null;
  esEdicion: boolean = false;
  tituloFormulario: string = 'Registrar Nuevo Pago';

  estados: string[] = ['PENDIENTE', 'COMPLETADO', 'RECHAZADO'];
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
        this.pagoId = +idParam;
        this.esEdicion = true;
        this.tituloFormulario = 'Modificar Pago';
        this.cargarPagoParaEdicion(this.pagoId);
      }
    });
  }

  cargarPagoParaEdicion(id: number): void {
    this.pagosService.obtenerPagoPorId(id).subscribe({
      next: (data: PagoResponse) => {
        this.pago = {
          monto: data.monto,
          metodo: data.metodo,
          estado: data.estado,
          emailUsuario: data.emailUsuario
        };
      },
      error: () => {
        alert('No se pudo cargar el pago para edición.');
        this.router.navigate(['/pagos']);
      }
    });
  }

  guardarPago(): void {
    if (this.esEdicion && this.pagoId !== null) {
      this.pagosService.actualizarPago(this.pagoId, this.pago).subscribe({
        next: () => {
          alert('Pago actualizado con éxito.');
          this.router.navigate(['/pagos']);
        },
        error: () => {
          alert('Error al actualizar el pago.');
        }
      });
    } else {
      this.pagosService.agregarPago(this.pago).subscribe({
        next: () => {
          alert('Pago registrado con éxito.');
          this.router.navigate(['/pagos']);
        },
        error: () => {
          alert('Error al registrar el pago.');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pagos']);
  }
}
