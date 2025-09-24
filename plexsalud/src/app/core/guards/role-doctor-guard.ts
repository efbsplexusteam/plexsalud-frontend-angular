import { CanActivateFn, Router } from '@angular/router';
import { State } from '../../modules/auth/services/state';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleDoctorGuard: CanActivateFn = (route, state) => {
  const stateService: State = inject(State);
  const snackBar: MatSnackBar = inject(MatSnackBar);
  const router: Router = inject(Router);

  if (stateService.role() !== "DOCTOR") {
    snackBar.open('Unauthorized', 'close', {
      verticalPosition: 'top',
      duration: 5000,
    });
    return router.navigate(['home']);
  } else {
    return true;
  }
};
