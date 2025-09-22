import { Routes } from '@angular/router';
import { jwtGuard } from './core/guards/jwt-guard';
import { loguedGuard } from './core/guards/logued-guard';
import { Landing } from './modules/landing/pages/landing/landing';

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
    canActivateChild: [jwtGuard],
    loadChildren: () => import('./modules/patient/routes/patient.routes').then((r) => r.PATIENT_ROUTES),
  },
];
