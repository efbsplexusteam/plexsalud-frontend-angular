import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login/:role',
        loadComponent: () => import('../pages/login/login').then((c) => c.Login),
      },
      {
        path: 'register/:role',
        loadComponent: () => import('../pages/register/register').then((c) => c.Register),
      },
    ],
  },
];
