import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const rolRequerido = route.data['rol'] as string;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const usuario = this.authService.usuarioValue;
    const rolUsuario = usuario?.rol;

    if (rolRequerido && rolUsuario !== rolRequerido) {
      this.router.navigate(['/no-autorizado']);
      return false;
    }
    return true;
  }
}
