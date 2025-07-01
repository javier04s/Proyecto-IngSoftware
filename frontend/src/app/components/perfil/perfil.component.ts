import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  isEditing: boolean = false;
  editedUsuario: Usuario | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;
  passwordTouched: boolean = false;
  emailInvalid: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioValue;

    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordsMatch = true;
      this.passwordTouched = false;
      this.emailInvalid = false; 
    } else {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  irAListaUsuarios(): void {
    this.router.navigate(['/usuarios/registrados']);
  }

  iniciarEdicion(): void {
    this.isEditing = true;
    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordsMatch = true;
      this.passwordTouched = false;
      this.emailInvalid = false; 
    }
  }

  onPasswordChange(): void {
    this.passwordTouched = true;
    this.passwordsMatch = this.newPassword === this.confirmPassword;
  }

  
  onEmailChange(): void {
    if (this.editedUsuario && this.editedUsuario.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
      this.emailInvalid = !emailRegex.test(this.editedUsuario.email);
    } else {
      this.emailInvalid = true; 
    }
  }

  guardarCambios(): void {
    if (!this.editedUsuario || !this.editedUsuario.id) {
      alert('No se pudo guardar los cambios. Usuario no válido o ID no encontrado.');
      return;
    }

    
    this.onEmailChange(); 
    if (this.emailInvalid) {
      alert('Por favor, ingresa un correo electrónico válido (ej. usuario@dominio.com).');
      return;
    }

    if (this.newPassword) {
      this.onPasswordChange();
      if (!this.passwordsMatch) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      this.editedUsuario.contrasena = this.newPassword;
    } else {
      if (this.usuario && this.usuario.contrasena) {
        this.editedUsuario.contrasena = this.usuario.contrasena;
      } else {
        alert(
          'Para actualizar, debes ingresar una nueva contraseña o tu contraseña actual para confirmar (si tu backend lo requiere).'
        );
        return;
      }
    }

    const usuarioParaBackend: any = {
      nombre: this.editedUsuario.nombre,
      email: this.editedUsuario.email,
      rol: this.editedUsuario.rol,
    };

    if (this.newPassword || (this.usuario && this.usuario.contrasena)) {
      usuarioParaBackend.contrasena = this.editedUsuario.contrasena || '';
    }

    this.usuarioService.modificarUsuario(this.editedUsuario.id, usuarioParaBackend).subscribe({
      next: (updatedUser) => {
        this.usuario = updatedUser;
        this.usuarioService.setUsuario(updatedUser);
        this.isEditing = false;
        alert('Perfil actualizado exitosamente.');
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordsMatch = true;
        this.passwordTouched = false;
        this.emailInvalid = false; 
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        alert('Hubo un error al actualizar el perfil. Inténtalo de nuevo.');
      },
    });
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.editedUsuario = this.usuario ? { ...this.usuario } : null;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordsMatch = true;
    this.passwordTouched = false;
    this.emailInvalid = false; 
  }

  eliminarPerfil(): void {
    if (
      this.usuario &&
      this.usuario.id &&
      confirm(
        '¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer.'
      )
    ) {
      this.usuarioService.eliminarUsuario(this.usuario.id).subscribe({
        next: () => {
          alert('Perfil eliminado exitosamente.');
          this.authService.logout();
        },
        error: (err) => {
          console.error('Error al eliminar el perfil:', err);
          alert('Hubo un error al eliminar el perfil. Inténtalo de nuevo.');
        },
      });
    }
  }
}