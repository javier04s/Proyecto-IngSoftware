import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioCrearDTO } from '../usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class RegistroComponent implements OnInit {

  registroForm!: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['CLIENTE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const usuario: UsuarioCrearDTO = this.registroForm.value;
      this.usuarioService.crearUsuario(usuario).subscribe({
        next: () => {
          alert('Usuario registrado correctamente');
          this.registroForm.reset();
        },
        error: (err) => {
          alert('Error al registrar usuario: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
