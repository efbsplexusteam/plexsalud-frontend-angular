import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('../pages/patient-profile/patient-profile').then((c) => c.PatientProfile),
      },
      {
        path: 'form',
        loadComponent: () => import('../pages/patient-form/patient-form').then((c) => c.PatientForm),
      },
      {
        path: 'appointment',
        loadComponent: () => import('../pages/appointment-form/appointment-form').then((c) => c.AppointmentForm),
      },
    ],
  },
];
