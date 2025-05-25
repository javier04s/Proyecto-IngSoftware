// auth.service.ts
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
    // Carga el usuario almacenado en localStorage al inicializar el servicio
    const usuarioJson = localStorage.getItem('usuario');
    this.usuarioSubject = new BehaviorSubject<Usuario | null>(
      usuarioJson ? JSON.parse(usuarioJson) : null
    );
    this.usuario$ = this.usuarioSubject.asObservable();
  }

  // Getter para obtener el valor actual del usuario
  public get usuarioValue(): Usuario | null {
    return this.usuarioSubject.value;
  }

  // Método para actualizar el usuario y almacenar token
  login(usuario: Usuario) {
    // Guarda usuario + token en localStorage para persistencia
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  // Método para verificar si está autenticado
  public isAuthenticated(): boolean {
    return !!this.usuarioValue?.token;
  }
}
