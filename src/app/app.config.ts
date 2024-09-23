import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors(
      [
        authInterceptor,
        loaderInterceptor,
      ]
    ),), provideAnimationsAsync()
  ]
};
