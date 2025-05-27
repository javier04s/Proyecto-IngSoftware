import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  mostrarModal = false;
  modalTipo: 'exito' | 'error' = 'exito';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.isLoading = true;

    const { email, contrasena } = this.loginForm.value;

    this.usuarioService.login(email, contrasena).subscribe({
      next: (response) => {
        const usuario = response.usuario;

        console.log('Usuario recibido en LoginComponent ANTES de setUsuario:', usuario);
        this.usuarioService.setUsuario(usuario);

        this.isLoading = false;
        this.modalTipo = 'exito';
        this.mostrarModal = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Credenciales inválidas o error de servidor.';
        this.modalTipo = 'error';
        this.mostrarModal = true;
      }
    });
  }

  continuar(): void {
    if (this.modalTipo === 'exito') {
      this.mostrarModal = false;
      this.router.navigate(['/']);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      this.mostrarModal = false;
    }
  }
}
