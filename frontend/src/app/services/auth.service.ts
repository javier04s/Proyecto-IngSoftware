import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() {
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
