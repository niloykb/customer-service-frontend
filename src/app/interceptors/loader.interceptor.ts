import { finalize, tap } from 'rxjs';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  loader.setRequestType(req.method);
  loader.showLoader();

  console.log('Outgoing HTTP request', req.url);
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      console.log('Incoming HTTP response', event);
    }),
    finalize(() => loader.hideLoader())
  );
  return next(req);
};
