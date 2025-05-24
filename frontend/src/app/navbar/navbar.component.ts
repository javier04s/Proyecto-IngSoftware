import { Component, OnInit } from '@angular/core';
import { UsuarioService, Usuario } from '../services/usuario.service';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  rolUsuario: string = 'Visitante';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.rolUsuario = usuario ? usuario.rol : 'Visitante';
    });
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.rolUsuario = 'Visitante';
    this.router.navigate(['/']);
  }
}
