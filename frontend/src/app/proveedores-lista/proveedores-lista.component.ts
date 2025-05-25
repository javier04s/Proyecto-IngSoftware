import { Component, inject, OnInit} from '@angular/core';
import { Proveedor } from '../proveedor';
import { ProveedorService } from '../services/proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor-lista',
  imports: [],
  templateUrl: './proveedores-lista.component.html',
})
export class ProveedorListaComponent implements OnInit {
  proveedores: Proveedor[] = [];

  private proveedorServicio = inject(ProveedorService)

  constructor(private router: Router) {}
  
  ngOnInit(){
    this.obtenerProveedores();
  }

  private obtenerProveedores(): void {
    this.proveedorServicio.ObtenerProveedoresLista().subscribe({
      next: (datos) => {
        this.proveedores = datos;
      },
      error: (error) => {
        console.error('Error al obtener la lista de proveedores', error);
      }
    });
  }

  interfazAggProveedor(): void {
    this.router.navigate(['/proveedores/agregar']);
  }
}