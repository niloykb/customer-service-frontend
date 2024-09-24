import { finalize, tap } from 'rxjs';
import { inject } from '@angular/core';

import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../shared/services/loader.service';

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
