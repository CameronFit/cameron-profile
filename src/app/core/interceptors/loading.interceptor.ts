// src/app/core/interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

let inFlight = 0;
export const getInFlight = () => inFlight; // optional helper if you want to read it

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  inFlight++;
  return next(req).pipe(
    finalize(() => {
      inFlight = Math.max(0, inFlight - 1);
    })
  );
};
