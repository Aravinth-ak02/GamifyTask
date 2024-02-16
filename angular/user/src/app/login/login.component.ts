import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../service/notification.service';
import { environment } from 'src/environment/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ApiConfig } from '../helpers/api-config';
import { DataStoreService } from '../service/data-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginpage: string = 'login';
  environment: any = environment;
  constructor(
    private notify: NotificationService,
    private activateRoute: ActivatedRoute,
    private ApiService: ApiService,
    private route: Router,
    private store:DataStoreService
  ) {
    window.scroll(0, 0);
    this.store.userDetails.subscribe(result=>{
      if(result && result.user_id){
        this.route.navigate(["/"]);
      }
    })
    this.activateRoute.params.subscribe((result: any) => {
      if (result && result.page) {
        this.loginpage = result.page
      }
    })
  }

  loginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.ApiService.commonApi(ApiConfig.userLogin.method, ApiConfig.userLogin.url, loginForm.value).subscribe((result: any) => {
        if (result && result.status) {
          this.notify.showSuccess(result.message);
          localStorage.setItem("userDetails", JSON.stringify(result.response));
          this.route.navigate(["/"]);
        } else {
          this.notify.showError(result.message)
        }
      })
    } else {
      this.notify.showError("Please fill all the valid details")
    }
  }
  registerSubmit(loginForm: NgForm) {
    let data = loginForm.value;
    if (loginForm.valid) {
      if(data.password != data.confirm_password){
        this.notify.showError("Password and confirm password not matched");
        return
      }
      this.ApiService.commonApi(ApiConfig.userRegister.method, ApiConfig.userRegister.url, loginForm.value).subscribe((result: any) => {
        if (result && result.status) {
          this.notify.showSuccess(result.message);
          localStorage.setItem("userDetails", JSON.stringify(result.response));
          this.route.navigate(["/"]);
        } else {
          this.notify.showError(result.message)
        }
      });
    } else {
      this.notify.showError("Please fill all valid details")
    }
  }

}
