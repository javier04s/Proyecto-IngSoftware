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
      const nomRepetido = proveedores.some(p => p.nombre.toLowerCase().trim() === this.proveedor.nombre.toLowerCase().trim());
      const tlfValido = /^\d{4}-\d{7}$/.test(this.proveedor.telefono);
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.proveedor.email);
      const plzValido = /^[1-12]\d*\s(días|día|mes|meses|semana|semanas)$/.test(this.proveedor.plazoEntrega);

      if (nomRepetido) {
        alert("Ya existe un proveedor con ese nombre.");
        return this.interfazProveedores();
      }

      if(!tlfValido){
        alert("El número de teléfono debe tener el formato 0XXX-XXXXXXX");
        return this.interfazProveedores();
      }

      if (!emailValido) {
        alert("Por favor, introduce un email válido.");
        return this.interfazProveedores();
      }

      if (!plzValido){
        alert("Recuerda que debes ingresar un plazo válido");
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