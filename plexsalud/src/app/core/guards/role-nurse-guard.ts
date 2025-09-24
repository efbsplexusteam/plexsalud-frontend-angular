import { CanActivateFn, Router } from '@angular/router';
import { State } from '../../modules/auth/services/state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';

export const roleNurseGuard: CanActivateFn = (route, state) => {
  const stateService: State = inject(State);
  const snackBar: MatSnackBar = inject(MatSnackBar);
  const router: Router = inject(Router);

  if (stateService.role() !== 'NURSE') {
    snackBar.open('Unauthorized', 'close', {
      verticalPosition: 'top',
      duration: 5000,
    });
    return router.navigate(['home']);
  } else {
    return true;
  }
};
