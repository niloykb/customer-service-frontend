import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};