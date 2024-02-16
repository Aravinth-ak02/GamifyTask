import { Component } from '@angular/core';
import { environment } from 'src/environment/environment';
import { DataStoreService } from './service/data-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = environment.title;
  constructor(
    private store: DataStoreService
    ) {
    let userDetails = localStorage.getItem('userDetails') as any;
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      this.store.userDetails.next(userDetails);
    }
  }
}
