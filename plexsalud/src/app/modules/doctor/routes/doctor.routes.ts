import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('../pages/doctor-profile/doctor-profile').then((c) => c.DoctorProfile),
      },
      {
        path: 'form',
        loadComponent: () => import('../pages/doctor-form/doctor-form').then((c) => c.DoctorForm),
      },
    ],
  },
];
