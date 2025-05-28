// src/app/components/navbar/navbar.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service'; // Importamos Usuario de AuthService
import { Subscription } from 'rxjs'; // Importamos Subscription

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {

  estaAutenticado: boolean = false;
  rolUsuario: string | null = null; // Para almacenar el rol del usuario
  private authSubscription: Subscription | undefined; // Para la suscripción al AuthService

  constructor(
    private router: Router,
    private authService: AuthService // Inyectamos AuthService
  ) { }

  ngOnInit(): void {
    // Suscripción para obtener el estado de autenticación y el rol del usuario
    this.authSubscription = this.authService.usuario$.subscribe((usuario: Usuario | null) => {
      this.estaAutenticado = usuario !== null;
      this.rolUsuario = usuario ? usuario.rol : null;
      console.log('Rol en Navbar (desde usuario$):', this.rolUsuario); // Para depuración
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  cerrarSesion(): void {
    this.authService.logout(); // Usamos el logout de AuthService
    // El 'usuario$' observable se encargará de actualizar estaAutenticado y rolUsuario a null
    this.router.navigate(['/']);
  }

  confirmarCerrarSesion(): void {
    const modalElement = document.getElementById('cerrarSesionModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide(); // Cierra el modal
    this.cerrarSesion();   // Ejecuta el cierre de sesión
  }
}