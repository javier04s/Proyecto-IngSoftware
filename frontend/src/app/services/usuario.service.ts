import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UsuarioCrearDTO } from '../usuario';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  fechaCreacion: string;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/usuarios';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      this.usuarioSubject.next(JSON.parse(usuarioString));
    }
  }

  crearUsuario(usuario: UsuarioCrearDTO): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  login(email: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:8080/auth/login',
      { email, contrasena },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  setUsuario(usuario: Usuario): void {
    this.usuarioSubject.next(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  clearUsuario(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuario');
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  logout(): void {
    this.clearUsuario();
  }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  cargarUsuarioDesdeStorage(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      this.usuarioSubject.next(JSON.parse(usuarioString));
    }
  }
}
