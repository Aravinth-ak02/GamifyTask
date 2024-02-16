import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataStoreService } from './data-store.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private store: DataStoreService
  ) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the JWT token from your authentication service or wherever you store it
    let userDetails = localStorage.getItem('userDetails') as any;
    if(userDetails){
      userDetails = JSON.parse(userDetails);
      const authToken = userDetails.token;
      // this.store.userDetails.next(userDetails);
      // Clone the request and add the JWT token to the headers
      request = request.clone({
        setHeaders: {
          Authorization: `${authToken}`
        }
      });
      // Pass the cloned request with the JWT token to the next handler
    }
    return next.handle(request);
  }
}
