import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  imports: [NgIf, NgFor]
})
export class ListaUsuariosComponent implements OnInit {
  usuariosRegistrados: Usuario[] = [];
  error: string | null = null;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.getAllUsuarios().subscribe({
      next: (data) => {
        this.usuariosRegistrados = data;
      },
      error: (err) => {
        this.error = 'Error al cargar los usuarios.';
      }
    });
  }
}
