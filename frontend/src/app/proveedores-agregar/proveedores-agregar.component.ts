import { Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../proveedor';
import { ProveedorService } from '../services/proveedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores-agregar',
  imports: [FormsModule],
  templateUrl: './proveedores-agregar.component.html'
})
export class ProveedoresAgregarComponent {
  proveedor: Proveedor= new Proveedor();

  private proveedorServicio = inject(ProveedorService);
    private router = inject (Router);

  onSubmit(){
    this.guardarProveedor();
  }

  guardarProveedor() {
  this.proveedorServicio.ObtenerProveedoresLista().subscribe({
    next: (proveedores) => {
      const repetido = proveedores.some(p => p.nombre.toLowerCase().trim() === this.proveedor.nombre.toLowerCase().trim());

      if (repetido) {
        alert("Ya existe un proveedor con ese nombre.");
        return this.interfazProveedores();
      }

      this.proveedorServicio.AgregarProveedor(this.proveedor).subscribe({
        next: () => {
          this.interfazProveedores();
        },
        error: (error: any) => {
          console.log(error);
          alert("Error al agregar proveedor.");
        }
      });
    },
    error: (err) => console.log(err)
  });
}
  interfazProveedores(){
    this.router.navigate(["/proveedores"]);
  }
}
