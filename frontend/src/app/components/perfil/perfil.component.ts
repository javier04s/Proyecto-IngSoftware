import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  usuariosRegistrados: Usuario[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioActual();
    console.log('Objeto usuario completo:', this.usuario);
    if (this.usuario) {
      console.log('Valor de usuario.fechaCreacion:', this.usuario.fechaCreacion);
    }

    this.usuarioService.getAllUsuarios().subscribe((data: Usuario[]) => {
      this.usuariosRegistrados = data;
    });

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuariosRegistrados = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  irAListaUsuarios(): void {
    this.router.navigate(['/usuarios/registrados']);
  }

}
