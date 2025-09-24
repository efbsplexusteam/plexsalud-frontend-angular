import { Routes } from '@angular/router';
import { jwtGuard } from './core/guards/jwt-guard';
import { loguedGuard } from './core/guards/logued-guard';
import { Landing } from './modules/landing/pages/landing/landing';
import { rolePatientGuard } from './core/guards/role-patient-guard';
import { roleDoctorGuard } from './core/guards/role-doctor-guard';
import { roleNurseGuard } from './core/guards/role-nurse-guard';

export const routes: Routes = [
  { path: 'home', component: Landing },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'auth',
    canActivateChild: [loguedGuard],
    loadChildren: () => import('./modules/auth/routes/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: 'patient',
    canActivateChild: [jwtGuard, rolePatientGuard],
    loadChildren: () =>
      import('./modules/patient/routes/patient.routes').then((r) => r.PATIENT_ROUTES),
  },
  {
    path: 'doctor',
    canActivateChild: [jwtGuard, roleDoctorGuard],
    loadChildren: () =>
      import('./modules/doctor/routes/doctor.routes').then((r) => r.DOCTOR_ROUTES),
  },
  {
    path: 'nurse',
    canActivateChild: [jwtGuard, roleNurseGuard],
    loadChildren: () => import('./modules/nurse/routes/nurse.routes').then((r) => r.NURSE_ROUTES),
  },
];
