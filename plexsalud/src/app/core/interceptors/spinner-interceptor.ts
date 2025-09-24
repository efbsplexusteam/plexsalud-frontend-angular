import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Spinner } from '../services/spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  let timer: any; // Guardar el temporizador
  const spinnerService: Spinner = inject(Spinner);

  timer = setTimeout(() => {
    spinnerService.show();
  }, 1000);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(timer);
      spinnerService.hide();
    })
  );
};
