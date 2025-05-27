import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../model/producto';

@Component({
  selector: 'app-productos-proveedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-proveedor.component.html'
})
export class ProductosProveedorComponent implements OnInit {
  productos: Producto[] = [];
  proveedorId!: number;

  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.proveedorId = idParam ? Number(idParam) : NaN;

      if (!isNaN(this.proveedorId)) {
        this.productoService.obtenerProductosPorProveedor(this.proveedorId).subscribe({
          next: (data) => this.productos = data,
          error: (err) => console.error('Error al obtener productos del proveedor:', err)
        });
      } else {
        console.warn('ID del proveedor inválido');
      }
    });
  }

  volverDetalle(): void {
    this.router.navigate([`/proveedores/detalle/${this.proveedorId}`]);
  }

}
