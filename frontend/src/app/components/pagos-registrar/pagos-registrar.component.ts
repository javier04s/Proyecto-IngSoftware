// pagos-registrar.component.ts
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

  pago: PagoRequest = {
    monto: 0,
    metodo: '',
    estado: 'PENDIENTE',
    emailUsuario: '',
    productos: [],
    // Nuevos campos para la tarjeta de crédito
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: ''
  };

  pagoId: number | null = null;
  esEdicion: boolean = false;
  tituloFormulario: string = 'Registrar Nuevo Pago';

  estados: string[] = ['PENDIENTE', 'COMPLETADO', 'RECHAZADO'];
  metodos: string[] = ['TARJETA']; // Asegúrate de que 'TARJETA' esté en la lista de métodos

  productosDisponibles: Producto[] = [];

  errorStock: string = '';
  errorTarjeta: string = ''; // Nuevo para manejar errores de tarjeta

  rolUsuario: string | null = null;

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

    this.rolUsuario = this.authService.getRol();
    console.log('Rol del usuario en PagosRegistrarComponent:', this.rolUsuario);

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
    this.errorStock = '';
    console.log('Productos en pago antes de calcular:', this.pago.productos);
    let total = 0;

    for (const item of this.pago.productos) {
      console.log('Procesando item:', item, `productoId tipo: ${typeof item.productoId}`);

      if (item.productoId != null && +item.productoId > 0 && item.cantidad > 0) {
        const idProducto = Number(item.productoId);
        const producto = this.productosDisponibles.find(p => Number(p.id) === idProducto);

        console.log('Producto encontrado:', producto);

        if (producto) {
          if (item.cantidad > producto.cantidad) {
            this.errorStock = `No hay suficiente stock para el producto "${producto.nombre}". Stock disponible: ${producto.cantidad}.`;
            console.warn(this.errorStock);
            this.pago.monto = 0;
            return;
          }
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
          productos: data.productos ? data.productos.map(p => ({
            productoId: p.productoId,
            cantidad: p.cantidad
          })) : [],
          // Asignar datos de tarjeta si existen (para edición)
          numeroTarjeta: data.numeroTarjeta || '',
          fechaExpiracion: data.fechaExpiracion || '',
          cvv: data.cvv || '',
          nombreTitular: data.nombreTitular || ''
        };
      },
      error: () => {
        alert('No se pudo cargar el pago para edición.');
        this.router.navigate(['/pagos']);
      }
    });
  }

  // --- Funciones de Validación de Tarjeta de Crédito ---

  validarNumeroTarjeta(numero: string): boolean {
    // Implementa el algoritmo de Luhn o una validación de longitud simple
    // Aquí una validación de longitud y solo dígitos
    const cleanedNum = numero.replace(/\s/g, ''); // Eliminar espacios
    return /^[0-9]{13,19}$/.test(cleanedNum);
  }

  validarFechaExpiracion(fecha: string): boolean {
    const parts = fecha.split('/');
    if (parts.length !== 2) {
      return false;
    }
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return false;
    }

    const currentYear = new Date().getFullYear() % 100; // Obtener los dos últimos dígitos del año actual
    const currentMonth = new Date().getMonth() + 1; // getMonth() es 0-indexed

    // Convertir el año de expiración a un formato de cuatro dígitos (ej: 23 -> 2023)
    const fullExpYear = 2000 + year;

    if (fullExpYear < (new Date().getFullYear()) || (fullExpYear === (new Date().getFullYear()) && month < currentMonth)) {
      return false; // La tarjeta ya expiró
    }

    return true;
  }

  validarCvv(cvv: string): boolean {
    return /^[0-9]{3,4}$/.test(cvv);
  }

  validarNombreTitular(nombre: string): boolean {
    // Permite letras, espacios y algunos caracteres especiales como guiones o apóstrofes
    return /^[a-zA-Z\s'-]+$/.test(nombre);
  }

  // --- Fin Funciones de Validación de Tarjeta de Crédito ---

  guardarPago(): void {
    if (this.errorStock) {
      alert(this.errorStock);
      return;
    }

    // Validar campos de tarjeta solo si el método de pago es 'TARJETA'
    if (this.pago.metodo === 'TARJETA') {
      if (!this.validarNumeroTarjeta(this.pago.numeroTarjeta || '')) {
        this.errorTarjeta = 'Número de tarjeta inválido.';
        alert(this.errorTarjeta);
        return;
      }
      if (!this.validarFechaExpiracion(this.pago.fechaExpiracion || '')) {
        this.errorTarjeta = 'Fecha de expiración inválida o expirada.';
        alert(this.errorTarjeta);
        return;
      }
      if (!this.validarCvv(this.pago.cvv || '')) {
        this.errorTarjeta = 'CVV inválido.';
        alert(this.errorTarjeta);
        return;
      }
      if (!this.validarNombreTitular(this.pago.nombreTitular || '')) {
        this.errorTarjeta = 'Nombre del titular inválido.';
        alert(this.errorTarjeta);
        return;
      }
      this.errorTarjeta = ''; // Limpiar errores si todo es válido
    }

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