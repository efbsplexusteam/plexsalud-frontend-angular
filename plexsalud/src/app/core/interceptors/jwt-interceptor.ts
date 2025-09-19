import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../../modules/auth/services/auth';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = sessionStorage.getItem('access_token');

  const authService: Auth = inject(Auth);

  let reqClone = req;
  /* PROBAR HAY QUE MANDAR LOS 2 */
  reqClone = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
    withCredentials: true, // para enviar cookies
  });
  return next(reqClone).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.warn('❌ Token expirado, intentando refrescar...');
        return authService.refreshToken().pipe(
          switchMap((data) => {
            // Reintentar la solicitud con el nuevo token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${data.accessToken}` },
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(
              () => new Error('⚠️ Error al refrescar el token:', refreshErr)
            );
          })
        );
      }
      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};