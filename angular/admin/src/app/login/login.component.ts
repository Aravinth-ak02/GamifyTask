import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ApiConfig } from '../helper/api-config';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  environment:any = environment;
  constructor(
    private notify: NotificationService,
    private activateRoute: ActivatedRoute,
    private ApiService: ApiService,
    private route:Router
  ){}

  loginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.ApiService.commonApi(ApiConfig.adminLogin.method,ApiConfig.adminLogin.url,loginForm.value).subscribe((result:any)=>{
        if(result && result.status){
          localStorage.setItem("adminDetails",JSON.stringify(result.response));
          this.notify.showSuccess(result.message);
          this.route.navigate(["/"])
        }else{
          this.notify.showError(result.message)
        }
      })
    } else {
      this.notify.showError("Please fill all the valid details")
    }
  }

}
