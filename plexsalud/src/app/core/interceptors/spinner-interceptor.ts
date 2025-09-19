import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Spinner } from '../services/spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  let timer: any; // Guardar el temporizador
  const spinnerService: Spinner = inject(Spinner);

  // Inicia un temporizador de 1 segundo antes de mostrar el spinner
  timer = setTimeout(() => {
    spinnerService.show(); // Muestra el spinner si la petición aún no ha terminado
  }, 1000);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(timer); // Si la petición terminó antes de 1s, cancela el spinner
      spinnerService.hide(); // Oculta el spinner cuando la petición finaliza
    })
  );
};
