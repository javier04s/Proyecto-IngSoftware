import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
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

  login(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
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
}
