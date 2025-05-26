import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { APP_INITIALIZER, inject, Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './app/services/auth.service';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

const authInitializer: Provider = {
  provide: APP_INITIALIZER,
  useFactory: () => {
    const authService = inject(AuthService);
    return () => {
      authService.cargarUsuarioDesdeStorage();
      return Promise.resolve();
    };
  },
  multi: true
};

const authInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    authInitializer,
    authInterceptorProvider
  ]
}).catch(err => console.error(err));
