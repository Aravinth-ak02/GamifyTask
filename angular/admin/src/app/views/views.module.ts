import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ViewsRoutingModule } from './views-routing.module';
import { ActivitiesComponent } from './activities/activities.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ViewsComponent } from './views.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    ActivitiesComponent,
    ViewsComponent
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ]
})
export class ViewsModule { }
