import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  public userDetails :BehaviorSubject<any>
  constructor() {
    this.userDetails = new BehaviorSubject<any>({});
   }
}
