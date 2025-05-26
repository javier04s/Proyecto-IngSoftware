import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const usuario = this.authService.usuarioValue;

    if (usuario && usuario.rol) {
      const cloned = req.clone({
        setHeaders: {
          'rol': usuario.rol
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
