import { Component } from '@angular/core';
import { environment } from 'src/environment/environment';
import { DataStoreService } from '../service/data-store.service';
import { NotificationService } from '../service/notification.service';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent {
  environment:any = environment;
  adminDetails:any;
  constructor(
    private store:DataStoreService,
    private notify:NotificationService,
    private ApiService:ApiService
  ){
    this.store.userDetails.subscribe(result=>{
      if(result){
        this.adminDetails = result;
      }
    })
  }

  logoutUser(){
    this.ApiService.logout();
  }
}
