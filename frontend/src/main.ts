import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { inject } from '@angular/core';
import { AuthService } from './app/services/auth.service';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    {
      provide: 'APP_INITIALIZER',
      useFactory: () => {
        const authService = inject(AuthService);
        return () => Promise.resolve(authService.usuarioValue || authService.cargarUsuarioDesdeStorage());
      },
      multi: true
    }
  ]
}).catch(err => console.error(err));

