import { Component } from '@angular/core';
import { DataStoreService } from './service/data-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'admin';
  constructor(
    private store: DataStoreService
    ) {
    let userDetails = localStorage.getItem('adminDetails') as any;
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const authToken = userDetails.token;
      this.store.userDetails.next(userDetails);
    }
  }
}
