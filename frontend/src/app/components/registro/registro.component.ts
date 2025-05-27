import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioCrearDTO } from '../../model/usuario';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf]
})
export class RegistroComponent implements OnInit {

  registroForm!: FormGroup;
  mostrarModal = false;
  modalTipo: 'exito' | 'error' = 'exito';

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
    if (this.registroForm.invalid) {
      return;
    }
    const usuario: UsuarioCrearDTO = this.registroForm.value;

    this.usuarioService.crearUsuario(usuario).subscribe({
      next: () => {
        this.modalTipo = 'exito';
        this.mostrarModal = true;
        this.registroForm.reset();
      },
      error: (err) => {
        this.modalTipo = 'error';
        this.mostrarModal = true;
      }
    });
  }
}
