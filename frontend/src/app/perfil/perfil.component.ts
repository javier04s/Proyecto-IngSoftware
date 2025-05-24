import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../services/usuario.service';
import { NgFor, NgIf, CommonModule} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [NgIf, CommonModule]
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  esAdmin: boolean = false;
  usuariosRegistrados: Usuario[] = [];

  constructor(private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioActual();
    this.esAdmin = this.usuario?.rol === 'ADMINISTRADOR';

    if (this.esAdmin) {
      this.usuarioService.getAllUsuarios().subscribe((data: Usuario[]) => {
        this.usuariosRegistrados = data;
      });
    }
  }

  irAListaUsuarios(): void {
    this.router.navigate(['/usuarios/registrados']);
  }

}
