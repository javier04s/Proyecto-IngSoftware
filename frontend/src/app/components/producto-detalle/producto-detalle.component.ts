import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CommonModule, NgIf } from '@angular/common';
import { Usuario, UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  templateUrl: './producto-detalle.component.html',
  imports: [NgIf, CommonModule]
})
export class ProductoDetalleComponent implements OnInit {
  producto: any;
  error: string | null = null;
  usuario: Usuario | null = null;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(usuario => this.usuario = usuario);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productoService.getProductoById(+id).subscribe({
        next: (data) => {
          this.producto = data;

          if (!this.producto.proveedor) {
            this.producto.proveedor = {
              nombre: '',
              telefono: '',
              email: '',
              localizacion: '',
              plazoEntrega: ''
            };
          }
        },
        error: (err) => {
          this.error = 'No se pudo cargar el producto.';
        }
      });
    }
  }

  volverMenu(): void {
    this.router.navigate(['/']);
  }

  registrarPago(): void {
    if (!this.usuario) {
      this.router.navigate(['/iniciar-sesion']);
    } else {
      this.router.navigate(['/pagos']);
    }
  }
}
