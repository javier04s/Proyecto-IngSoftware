import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UsuarioCrearDTO } from '../usuario';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fechaCreacion: string;
  token?: string;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;
  token: string;
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

  setUsuario(usuario: Usuario, token: string): void {
    const usuarioConToken = { ...usuario, token };
    this.usuarioSubject.next(usuarioConToken);
    localStorage.setItem('usuario', JSON.stringify(usuarioConToken));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearUsuario(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuario');
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getAllUsuarios(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/usuarios');
  }

  getUsuarioLogueado(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}`);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

}
