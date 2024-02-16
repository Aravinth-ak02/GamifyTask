import { Component } from '@angular/core';
import { environment } from 'src/environment/environment';
import { DataStoreService } from '../service/data-store.service';
import { NotificationService } from '../service/notification.service';
import { ApiService } from '../service/api.service';
import { ApiConfig } from '../helpers/api-config';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent {
  environment: any = environment;
  userDetails:any;
  constructor(
    private store:DataStoreService,
    private notify :NotificationService,
    private ApiService :ApiService
  ){
    this.store.userDetails.subscribe(result=>{
      if(result && result.user_id){
        this.userDetails = result;
      }
    })
  }

  ngOnInit(){
    let userFind = localStorage.getItem("userDetails");
    if(userFind){
      userFind = JSON.parse(userFind);
      this.store.userDetails.next(userFind)
      this.findUser();
    }
  }

  logoutUser(){
    this.ApiService.logoutUser()
  }

  findUser(){
    this.ApiService.commonApi(ApiConfig.userDetailsGet.method,ApiConfig.userDetailsGet.url,{}).subscribe(result=>{
      if(result && result.status){
        let userFetch = result.response;
        this.userDetails.username = userFetch.username;
        this.userDetails.email = userFetch.email;
        this.userDetails.overall_points = userFetch.overall_points;
        this.store.userDetails.next(this.userDetails);
      }
    })
  }

}
