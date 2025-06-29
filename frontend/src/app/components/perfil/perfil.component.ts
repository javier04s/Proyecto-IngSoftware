import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Necesario si usas authService en otros métodos

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

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService // Asegúrate de que AuthService esté inyectado si lo usas
  ) {}

  ngOnInit(): void {
    // Si usas AuthService para manejar el usuario logeado, usa su valor
    this.usuario = this.authService.usuarioValue; // Obtener usuario del AuthService
    // Si usuarioService es la única fuente, mantén: this.usuario = this.usuarioService.getUsuarioActual();

    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordsMatch = true;
      this.passwordTouched = false;
    } else {
      // Opcional: Si no hay usuario, redirigir a la página de login
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
    }
  }

  onPasswordChange(): void {
    this.passwordTouched = true;
    this.passwordsMatch = this.newPassword === this.confirmPassword;
  }

  guardarCambios(): void {
    if (!this.editedUsuario || !this.editedUsuario.id) {
      alert('No se pudo guardar los cambios. Usuario no válido o ID no encontrado.');
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
      // Mantener la contraseña existente si no se proporciona una nueva y tu backend lo requiere
      if (this.usuario && this.usuario.contrasena) {
        this.editedUsuario.contrasena = this.usuario.contrasena;
      }
      // Considera si tu backend acepta PUT sin contraseña si no se va a cambiar.
      // Si no, y el usuario no cambia la contraseña, deberías enviarle la antigua.
      // Tu código actual ya maneja esto.
    }

    const usuarioParaBackend: any = {
      nombre: this.editedUsuario.nombre,
      email: this.editedUsuario.email,
      // No incluimos 'fechaCreacion' aquí, lo cual es correcto para evitar enviarla
      rol: this.editedUsuario.rol,
    };

    // Solo incluye la contraseña si se ha modificado o si el backend la requiere siempre
    if (this.newPassword || (this.usuario && this.usuario.contrasena)) {
        usuarioParaBackend.contrasena = this.editedUsuario.contrasena || '';
    }

    this.usuarioService.modificarUsuario(this.editedUsuario.id, usuarioParaBackend).subscribe({
      next: (updatedUser) => {
        this.usuario = updatedUser;
        this.usuarioService.setUsuario(updatedUser); // Actualiza el usuario en el servicio
        this.isEditing = false;
        alert('Perfil actualizado exitosamente.');
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordsMatch = true;
        this.passwordTouched = false;
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