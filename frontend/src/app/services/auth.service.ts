import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioSubject: BehaviorSubject<Usuario | null>;
  public usuario$: Observable<Usuario | null>;

  constructor(private router: Router) {
    const usuarioJson = localStorage.getItem('usuario');
    this.usuarioSubject = new BehaviorSubject<Usuario | null>(
      usuarioJson ? JSON.parse(usuarioJson) : null
    );
    this.usuario$ = this.usuarioSubject.asObservable();
  }

  public get usuarioValue(): Usuario | null {
    return this.usuarioSubject.value;
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['productos']).then(() => {
      window.location.reload(); // <--- Aquí está la recarga forzada
    });
  }

  isAuthenticated(): boolean {
    return !!this.usuarioValue;
  }

  cargarUsuarioDesdeStorage(): void {
    const usuarioJson = localStorage.getItem('usuario');
    if (usuarioJson) {
      this.usuarioSubject.next(JSON.parse(usuarioJson));
    }
  }

  getEmailUsuario(): string | null {
    const usuario = this.usuarioValue;
    return usuario ? usuario.email : null;
  }

  getRol(): string | null {
    const usuario = this.usuarioValue;
    return usuario ? usuario.rol : null;
  }

}
