import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagosService } from '../../services/pagos.service';
import { ProductoService } from '../../services/producto.service';
import { PagoRequest, PagoResponse } from '../../model/pagos';
import { Producto } from './../../model/producto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pago-registrar',
  templateUrl: './pagos-registrar.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class PagosRegistrarComponent implements OnInit {

  pago: PagoRequest & { productos: { productoId: number | null; cantidad: number }[] } = {
    monto: 0,
    metodo: '',
    estado: '',
    emailUsuario: '',
    productos: []
  };
  pagoId: number | null = null;
  esEdicion: boolean = false;
  tituloFormulario: string = 'Registrar Nuevo Pago';

  estados: string[] = ['PENDIENTE', 'COMPLETADO', 'RECHAZADO'];
  metodos: string[] = ['TARJETA'];

  productosDisponibles: Producto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pagosService: PagosService,
    private productoService: ProductoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();

    const email = this.authService.getEmailUsuario();
    if (email) {
      this.pago.emailUsuario = email;
    } else {
      console.warn('No se encontró email de usuario logueado');
    }

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

  cargarProductos(): void {
    this.productoService.obtenerProductosLista().subscribe({
      next: (productos) => {
        this.productosDisponibles = productos;
        console.log('Productos cargados:', this.productosDisponibles);
      },
      error: () => {
        alert('Error al cargar productos disponibles.');
      }
    });
  }

  aceptarProductos(): void {
    console.log('Productos en pago antes de calcular:', this.pago.productos);
    let total = 0;

    for (const item of this.pago.productos) {
      console.log('Procesando item:', item, `productoId tipo: ${typeof item.productoId}`);

      if (item.productoId != null && +item.productoId > 0 && item.cantidad > 0) {
        const idProducto = Number(item.productoId);
        const producto = this.productosDisponibles.find(p => Number(p.id) === idProducto);

        console.log('Producto encontrado:', producto);

        if (producto) {
          total += producto.precio * item.cantidad;
        } else {
          console.warn(`No se encontró producto con id ${idProducto}`);
        }
      } else {
        console.warn('Item inválido (productoId o cantidad):', item);
      }
    }

    this.pago.monto = total;
    console.log('Monto total calculado:', total);
  }

  agregarProducto(): void {
    this.pago.productos.push({ productoId: null, cantidad: 1 });
  }

  eliminarProducto(index: number) {
    this.pago.productos.splice(index, 1);
    this.aceptarProductos();
  }

  cargarPagoParaEdicion(id: number): void {
    this.pagosService.obtenerPagoPorId(id).subscribe({
      next: (data: PagoResponse) => {
        this.pago = {
          monto: data.monto,
          metodo: data.metodo,
          estado: data.estado,
          emailUsuario: data.emailUsuario,
          productos: []
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
