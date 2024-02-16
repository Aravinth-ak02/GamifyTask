import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private notify :NotificationService,
    private route:Router
  ) { }

  commonApi(method:string,url:string,data:any): Observable<any>{
    return this.http[method](environment.api_url+url,data).pipe(
      tap( // Log the result or error
        data => {
        },
        error => this.handleError(error)
      )
    );
  }

  handleError(error){
    if(error && error.error){
      this.notify.showError(error.error.message)
    }
    if(error && error.error && error.error.logout){
      this.logoutUser();
    }
  }

  logoutUser(){
    localStorage.clear();
    this.notify.showSuccess("Logout successfully");
    setTimeout(() => {
      window.location.replace("/");
    }, 200);
  }

}
