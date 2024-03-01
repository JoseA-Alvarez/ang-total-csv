import {HttpInterceptorFn} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {switchMap, throwError} from "rxjs";
import {inject} from "@angular/core";
import {AuthService, UserUI} from "./shared/data-access/auth.service";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    },
  });

  return next(authReq).pipe(
    catchError((err) => {
      // Mirar Api
      if (err.status === 406) {
        console.log('error 406 refresco');
        return authService.renewToken().pipe(
          catchError((e) => {
            console.info('refresh token', e);
            authService.logout();
            return throwError(e);
          }),
          switchMap((response) => {
              authService.setItemInLocalStorage(response as UserUI);
              return next(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
              }));
            }
          ));

      }
      return throwError(err);
    })
  );
};
