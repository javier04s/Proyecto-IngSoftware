import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router'; // Importar Router si lo necesitas para redirigir

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router); // Si necesitas router para, por ejemplo, redirigir en 401

  const usuario = authService.usuarioValue;
  const token = usuario?.token;

  // Puedes añadir logs para depuración aquí si es necesario
  // console.log('TokenInterceptor (Function): Usuario logeado:', usuario);
  // console.log('TokenInterceptor (Function): Token obtenido:', token);

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });
    // console.log('TokenInterceptor (Function): Request clonada con Authorization header:', clonedReq.headers.get('Authorization'));
    return next(clonedReq); // <--- ¡AQUÍ ESTÁ EL CAMBIO CLAVE!
  }

  // console.log('TokenInterceptor (Function): No hay token, enviando request original.');
  return next(req); // <--- ¡Y AQUÍ TAMBIÉN!
};