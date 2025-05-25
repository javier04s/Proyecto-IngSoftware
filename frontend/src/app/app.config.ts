// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importa withInterceptors

import { routes } from './app.routes';
import { TokenInterceptor } from './token.interceptor'; // Asegúrate de la ruta

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([ // <--- **AQUÍ ESTÁ LA CLAVE**
      TokenInterceptor // Tu interceptor debe ir aquí
    ]))
  ]
};