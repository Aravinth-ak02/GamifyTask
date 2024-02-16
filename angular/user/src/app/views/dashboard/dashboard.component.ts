import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiConfig } from 'src/app/helpers/api-config';
import { ApiService } from 'src/app/service/api.service';
import { DataStoreService } from 'src/app/service/data-store.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  skip: number = 0;
  limit: number = 10;
  activityList: any = [];
  totalCount: number = 10;
  current_page: number = 1;
  userDetails: any;
  page_type: string = "leaderboard";
  id: any;
  user_details: any;
  date_value: any;
  monthPoints: number = 0;
  currentDate: Date = new Date();
  constructor(
    private ApiService: ApiService,
    private store: DataStoreService,
    private ActivateRoute: ActivatedRoute,
    private notify: NotificationService
  ) {
    this.store.userDetails.subscribe(result => {
      if (result && result.user_id) {
        this.userDetails = result;
      }
    });
    this.ActivateRoute.params.subscribe((result: any) => {
      if (result && result.type) {
        this.page_type = result.type;
        if (result.id) {
          this.id = result.id;
        };
      } else {
        this.page_type = "leaderboard";
      };
      this.changePage(this.page_type);
    })
  }

  leaderBoardGet() {
    let data = {
      skip: this.skip,
      limit: this.limit
    } as any;
    if (this.date_value) {
      data.date = this.date_value;
    }
    this.ApiService.commonApi(ApiConfig.leaderboardList.method, ApiConfig.leaderboardList.url, data).subscribe(result => {
      if (result && result.status) {
        this.activityList = result.response.list;
        this.totalCount = result.response.totalCounts;
      } else {
        this.activityList = [];
      }
    })
  }

  newActivitiesGet() {
    let data = {
      skip: this.skip,
      limit: this.limit
    }
    this.ApiService.commonApi(ApiConfig.newActivitiesList.method, ApiConfig.newActivitiesList.url, data).subscribe(result => {
      if (result && result.status) {
        this.activityList = result.response.list;
        this.totalCount = result.response.totalCounts;
      } else {
        this.activityList = [];
      }
    })
  }

  pageChanged(event) {
    if (event) {
      this.current_page = event.page;
      this.skip = (this.current_page - 1) * this.limit;
      switch (this.page_type) {
        case "leaderboard":
          this.leaderBoardGet();
          break;
        case "new-activity":
          this.newActivitiesGet();
          break;
        case "my-activity":
          this.myActivityList();
          break;
        case "activity":
          this.userActivityList();
          break;

        default:
          break;
      }
    }
  };

  completeActivity(activity_id) {
    if (activity_id) {
      let data = {
        activity_id: activity_id
      }
      this.ApiService.commonApi(ApiConfig.activityComplete.method, ApiConfig.activityComplete.url, data).subscribe(result => {
        if (result && result.status) {
          this.notify.showSuccess(result.message);
          this.newActivitiesGet();
          this.findUser()
        } else {
          this.notify.showError(result.message);
        }
      })
    }
  };

  myActivityList() {
    let data = {
      skip: this.skip,
      limit: this.limit,
    } as any;
    if (this.date_value) {
      data.date = this.date_value
    };
    this.ApiService.commonApi(ApiConfig.myActivityList.method, ApiConfig.myActivityList.url, data).subscribe(result => {
      if (result && result.status) {
        this.activityList = result.response.list;
        this.totalCount = result.response.totalCounts;
        this.user_details = result.response.userDetails;
        this.monthPoints = result.response.monthCount;
      } else {
        this.activityList = [];
        this.totalCount = 0;
      }
    })
  };

  findUser() {
    this.ApiService.commonApi(ApiConfig.userDetailsGet.method, ApiConfig.userDetailsGet.url, {}).subscribe(result => {
      if (result && result.status) {
        let userFetch = result.response;
        this.userDetails.username = userFetch.username;
        this.userDetails.email = userFetch.email;
        this.userDetails.overall_points = userFetch.overall_points;
        this.store.userDetails.next(this.userDetails);
      }
    })
  }

  userActivityList() {
    let data = {
      skip: this.skip,
      limit: this.limit,
    } as any;
    if (this.id) {
      data.userId = this.id;
      if (this.date_value) {
        data.date = this.date_value
      };
      this.ApiService.commonApi(ApiConfig.userActivityList.method, ApiConfig.userActivityList.url, data).subscribe(result => {
        if (result && result.status) {
          this.activityList = result.response.list;
          this.totalCount = result.response.totalCounts;
          this.user_details = result.response.userDetails;
          this.monthPoints = result.response.monthCount;
        } else {
          this.activityList = [];
          this.totalCount = 0;
        }
      })
    }
  };

  changePage(value) {
    if (value) {
      switch (value) {
        case "leaderboard":
          this.skip = 0;
          this.page_type = value;
          this.date_value = new Date();
          this.leaderBoardGet();
          break;
        case "new-activity":
          this.skip = 0;
          this.page_type = value;
          this.date_value = "";
          this.newActivitiesGet();
          break;
        case "my-activity":
          this.skip = 0;
          this.page_type = value;
          this.date_value = "";
          this.myActivityList();
          break;
        case "activity":
          this.skip = 0;
          this.page_type = value;
          this.date_value = "";
          this.userActivityList();
          break;

        default:
          break;
      }
    }
  }

  changeDate(event) {
    if (event) {
      this.date_value = new Date(event);
      this.skip = 0;
      switch (this.page_type) {
        case "leaderboard":
          this.leaderBoardGet();
          break;
        case "new-activity":
          this.newActivitiesGet();
          break;
        case "my-activity":
          this.myActivityList();
          break;
        case "activity":
          this.userActivityList();
          break;

        default:
          break;
      }
    }
  }

}
