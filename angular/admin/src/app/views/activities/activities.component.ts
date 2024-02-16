import { Component, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiConfig } from 'src/app/helper/api-config';
import { ApiService } from 'src/app/service/api.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
  skip: number = 0;
  limit: number = 10;
  modalRef?: BsModalRef;
  activityList: any = [];
  totalCount: number = 10;
  current_page: number = 1;
  date_value: any;
  constructor(
    private modalService: BsModalService,
    private ApiService: ApiService,
    private notify: NotificationService
  ) {
    this.activitiesList()
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  submitForm(activityForm: NgForm) {
    if (activityForm.valid) {
      this.ApiService.commonApi(ApiConfig.addActivity.method, ApiConfig.addActivity.url, activityForm.value).subscribe((result) => {
        if (result && result.status) {
          this.modalRef.hide();
          this.activitiesList()
          this.notify.showSuccess(result.message);
        } else {
          this.notify.showError(result.message)
        }
      })
    }
  };

  pageChanged(event) {
    if (event) {
      this.current_page = event.page;
      this.skip = (this.current_page - 1) * this.limit;
      this.activitiesList();
    }
  }

  activitiesList() {
    let data = {
      skip: this.skip,
      limit: this.limit
    } as any;
    if (this.date_value) {
      data.date = this.date_value;
    }
    this.ApiService.commonApi(ApiConfig.activityList.method, ApiConfig.activityList.url, data).subscribe((result) => {
      if (result && result.status) {
        this.activityList = result.response.list;
        this.totalCount = result.response.count;
      } else {
        this.activityList = [];
      }
    })
  }

  changeDate(event) {
    if (event) {
      this.skip = 0;
      this.date_value = new Date(event);
      this.activitiesList();
    }
  }

}
