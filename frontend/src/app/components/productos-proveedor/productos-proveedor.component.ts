import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  ngOnInit(): void {
    this.proveedorId = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(this.proveedorId)) {
      this.productoService.obtenerProductosPorProveedor(this.proveedorId).subscribe({
        next: (data) => {
          this.productos = data;
        },
        error: (err) => {
          console.error('Error al obtener productos del proveedor:', err);
        }
      });
    }
  }
}
