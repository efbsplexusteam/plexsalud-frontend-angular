import { Routes } from '@angular/router';
import { Login } from './modules/auth/pages/login/login';

export const routes: Routes = [
  { path: 'home', component: Login },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'auth',
    // canActivateChild: [jwtGuard],
    loadChildren: () => import('./modules/auth/routes/auth.routes').then((r) => r.AUTH_ROUTES),
  },
];
