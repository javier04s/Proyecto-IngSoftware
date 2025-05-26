import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const usuario = this.authService.usuarioValue;
    const rolesPermitidos = route.data['roles'] as Array<string>;

    if (!usuario) {
      this.router.navigate(['/iniciar-sesion']);
      return false;
    }

    if (rolesPermitidos && rolesPermitidos.includes(usuario.rol)) {
      return true;
    }

    window.alert('No tienes permisos para acceder a esta página');
    this.router.navigate(['/']);
    return false;
  }
}
