import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  ``
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.currentUserSig()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
