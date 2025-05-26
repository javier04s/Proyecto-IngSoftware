import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  estaAutenticado: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.estaAutenticado = usuario !== null;
    });
  }

  cerrarSesion(): void {
    this.usuarioService.logout();
    this.estaAutenticado = false;
    this.router.navigate(['/']);
  }
}
