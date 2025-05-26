import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Proveedor } from '../../model/proveedor';
import { ProveedorService } from '../../services/proveedor.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-proveedor-lista',
  templateUrl: './proveedores-lista.component.html'
})
export class ProveedorListaComponent implements OnInit, OnDestroy {
  proveedores: Proveedor[] = [];

  private proveedorService = inject(ProveedorService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private usuarioSub?: Subscription;

  ngOnInit() {
    this.usuarioSub = this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        console.log("ProveedorListaComponent: Usuario autenticado");

        this.obtenerProveedores();

      } else {
        console.warn("ProveedorListaComponent: Usuario no autenticado");
        this.proveedores = [];
      }
    });
  }

  ngOnDestroy() {
    this.usuarioSub?.unsubscribe();
  }

  private obtenerProveedores(): void {
    this.proveedorService.ObtenerProveedoresLista().subscribe({
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
