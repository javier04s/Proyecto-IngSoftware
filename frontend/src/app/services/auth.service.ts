import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioSubject: BehaviorSubject<Usuario | null>;
  public usuario$: Observable<Usuario | null>;

  constructor() {
    // Carga inicial automática desde localStorage
    const usuarioJson = localStorage.getItem('usuario');
    this.usuarioSubject = new BehaviorSubject<Usuario | null>(
      usuarioJson ? JSON.parse(usuarioJson) : null
    );
    this.usuario$ = this.usuarioSubject.asObservable();
  }

  public get usuarioValue(): Usuario | null {
    return this.usuarioSubject.value;
  }

  /**
   * Guarda el usuario y token en el BehaviorSubject y localStorage.
   * @param usuario Objeto usuario (sin token)
   * @param token Token JWT
   */
  login(usuario: Omit<Usuario, 'token'>, token: string) {
    const usuarioConToken: Usuario = { ...usuario, token };
    localStorage.setItem('usuario', JSON.stringify(usuarioConToken));
    this.usuarioSubject.next(usuarioConToken);
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.usuarioValue?.token;
  }


  /**
   * Recarga el usuario almacenado en localStorage (útil para APP_INITIALIZER)
   */
  cargarUsuarioDesdeStorage(): void {
    const usuarioJson = localStorage.getItem('usuario');
    if (usuarioJson) {
      this.usuarioSubject.next(JSON.parse(usuarioJson));
    }
  }
}