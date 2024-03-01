import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../data-access/auth.service';

export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (localStorage.getItem('refresh_token') ) {
      return true;
    }

    return router.parseUrl('auth/login');
  };
};
