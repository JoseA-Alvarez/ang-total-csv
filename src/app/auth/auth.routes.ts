import {Route} from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  {path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)},
  {path: 'login', loadComponent: () => import('./login/login.component')},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
