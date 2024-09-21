import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { finalize, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {

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
};
