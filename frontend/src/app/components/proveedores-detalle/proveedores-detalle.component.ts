import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../model/proveedor';

@Component({
  selector: 'app-proveedores-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proveedores-detalle.component.html'
})
export class ProveedoresDetalleComponent implements OnInit {
  proveedor: Proveedor | null = null;

  private route = inject(ActivatedRoute);
  private proveedorService = inject(ProveedorService);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.proveedorService.obtenerProveedorPorId(id).subscribe({
          next: (data) => this.proveedor = data,
          error: (err) => console.error('Error al obtener el proveedor:', err)
        });
      }
    });
  }


  volverListado(): void {
    this.router.navigate(['/proveedores']);
  }

  verProductosProveedor(): void {
    if (this.proveedor?.id) {
      this.router.navigate([`/proveedores/detalle/${this.proveedor.id}/productos`]);
    }
  }
}
