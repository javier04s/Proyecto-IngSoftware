import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Proveedor } from '../../model/proveedor';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './agregar-producto.component.html',
})
export class AgregarProductoComponent implements OnInit {
  agregarProductoForm: FormGroup;
  proveedores: Proveedor[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.agregarProductoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      marca: ['', Validators.required],
      proveedorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.productoService.obtenerProveedores().subscribe(
      data => {
        this.proveedores = data;
      },
      error => {
        console.error('Error al cargar proveedores:', error);
        this.errorMessage = 'No se pudieron cargar los proveedores. Inténtelo de nuevo más tarde.';
      }
    );
  }

  volverMenu(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.agregarProductoForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';

      const usuarioLogeado = this.authService.usuarioValue;
      if (!usuarioLogeado || !usuarioLogeado.id) {
        this.errorMessage = 'No se pudo obtener la información del usuario creador.';
        return;
      }

      const productoData = {
        ...this.agregarProductoForm.value,
        creadoPorId: usuarioLogeado.id
      };

      this.productoService.agregarProducto(productoData).subscribe(
        response => {
          this.successMessage = 'Producto agregado exitosamente.';
          this.agregarProductoForm.reset();
          this.router.navigate(['/productos']);
        },
        error => {
          console.error('Error al agregar producto:', error);
          if (error.status === 403) {
            this.errorMessage = 'No tienes permisos para agregar productos. Solo los administradores pueden hacerlo.';
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Ocurrió un error al agregar el producto. Inténtelo de nuevo.';
          }
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
    }
  }
}