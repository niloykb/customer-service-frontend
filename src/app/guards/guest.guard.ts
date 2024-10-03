import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    router.navigateByUrl('/admin/dashboard');
    return false;
  }

  return true;

}