import { Routes } from '@angular/router';

export const NURSE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('../pages/nurse-profile/nurse-profile').then((c) => c.NurseProfile),
      },
      {
        path: 'form',
        loadComponent: () => import('../pages/nurse-form/nurse-form').then((c) => c.NurseForm),
      },
    ],
  },
];
