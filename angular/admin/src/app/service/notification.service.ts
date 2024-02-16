import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr"
import { environment } from 'src/environment/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  environmnet: any = environment
  constructor(
    private toastr: ToastrService
  ) { }

  showSuccess(message: any) {
    this.toastr.success(message, environment.title, {
      progressBar: true,
      progressAnimation: "decreasing",
      closeButton: true
    })
  }
  showError(message: any) {
    console.log(message)
    this.toastr.error(message, environment.title, {
      progressBar: true,
      progressAnimation: "decreasing",
      closeButton: true
    })
  }
}
