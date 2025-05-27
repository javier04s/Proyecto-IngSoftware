export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fechaCreacion: string | Date;
}

export interface UsuarioCrearDTO {
  nombre: string;
  email: string;
  contrasena: string;
  rol: string;
}
