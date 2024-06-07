import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private AuthService:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const accessToken = this.AuthService.getAccessData()
    if(!accessToken) return next.handle(request);

    const newRequest = request.clone({
      headers: request.headers.append('Authorization', `Bearer ${accessToken.accessToken}`)
    })
      return next.handle(newRequest);

}
}


