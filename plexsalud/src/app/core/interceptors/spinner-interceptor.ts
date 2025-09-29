import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Spinner } from '../services/spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService: Spinner = inject(Spinner);

  spinnerService.show();

  return next(req).pipe(
    finalize(() => {
      spinnerService.hide();
    })
  );
};
