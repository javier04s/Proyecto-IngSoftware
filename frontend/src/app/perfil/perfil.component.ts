import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../services/usuario.service';
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
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioActual();

    // Ya no se verifica rol para cargar usuarios registrados
    this.usuarioService.getAllUsuarios().subscribe((data: Usuario[]) => {
      this.usuariosRegistrados = data;
    });
  }

  irAListaUsuarios(): void {
    this.router.navigate(['/usuarios/registrados']);
  }
}
